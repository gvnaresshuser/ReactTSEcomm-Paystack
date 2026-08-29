import { pool } from "../config/db.js";
import { paystack } from "../config/paystack.js";

// =====================================================
// CREATE ORDER FROM CART
// =====================================================

export const createOrderFromCart = async (userId: string) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cartResult = await client.query(
      `
      SELECT id
      FROM carts
      WHERE user_id = $1
      `,
      [userId],
    );

    if (cartResult.rows.length === 0) {
      throw new Error("Cart not found");
    }

    const cartId = cartResult.rows[0].id;

    const itemsResult = await client.query(
      `
      SELECT
        ci.product_id,
        ci.quantity,
        p.name,
        p.price,
        p.stock
      FROM cart_items ci
      INNER JOIN products p
        ON p.id = ci.product_id
      WHERE ci.cart_id = $1
      FOR UPDATE OF p
      `,
      [cartId],
    );

    const items = itemsResult.rows;

    if (items.length === 0) {
      throw new Error("Cart is empty");
    }

    let totalAmount = 0;

    for (const item of items) {
      if (item.quantity > item.stock) {
        throw new Error(
          `Insufficient stock for ${item.name}. ` +
            `Available: ${item.stock}, ` +
            `Requested: ${item.quantity}`,
        );
      }

      totalAmount += Number(item.price) * Number(item.quantity);
    }

    const orderResult = await client.query(
      `
      INSERT INTO orders (
        user_id,
        total_amount,
        status,
        payment_status
      )
      VALUES ($1, $2, 'Pending', 'Pending')
      RETURNING
        id,
        user_id,
        total_amount,
        status,
        payment_status,
        created_at,
        updated_at
      `,
      [userId, totalAmount],
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      const subtotal = price * quantity;

      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          price,
          quantity,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          order.id,
          item.product_id,
          item.name,
          price,
          quantity,
          subtotal,
        ],
      );
    }

    await client.query("COMMIT");

    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


// =====================================================
// GET USER ORDERS
// =====================================================

export const getOrdersByUser = async (userId: string) => {
  const ordersResult = await pool.query(
    `
    SELECT
      id,
      user_id,
      total_amount,
      status,
      payment_status,
      paystack_reference,
      created_at,
      updated_at
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId],
  );

  const orders = ordersResult.rows;

  for (const order of orders) {
    const itemsResult = await pool.query(
      `
      SELECT
        id,
        product_id,
        product_name,
        price,
        quantity,
        subtotal,
        created_at
      FROM order_items
      WHERE order_id = $1
      ORDER BY created_at ASC
      `,
      [order.id],
    );

    order.items = itemsResult.rows;
  }

  return orders;
};


// =====================================================
// GET SINGLE ORDER
// =====================================================

export const getOrderById = async (
  userId: string,
  orderId: string,
) => {
  const orderResult = await pool.query(
    `
    SELECT
      id,
      user_id,
      total_amount,
      status,
      payment_status,
      paystack_reference,
      created_at,
      updated_at
    FROM orders
    WHERE id = $1
      AND user_id = $2
    `,
    [orderId, userId],
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const order = orderResult.rows[0];

  const itemsResult = await pool.query(
    `
    SELECT
      id,
      product_id,
      product_name,
      price,
      quantity,
      subtotal,
      created_at
    FROM order_items
    WHERE order_id = $1
    ORDER BY created_at ASC
    `,
    [orderId],
  );

  order.items = itemsResult.rows;

  return order;
};


// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

export const getAllOrders = async () => {
  const ordersResult = await pool.query(
    `
    SELECT
      o.id,
      o.user_id,
      u.name AS user_name,
      u.email AS user_email,
      o.total_amount,
      o.status,
      o.payment_status,
      o.paystack_reference,
      o.created_at,
      o.updated_at
    FROM orders o
    INNER JOIN users u
      ON u.id = o.user_id
    ORDER BY o.created_at DESC
    `,
  );

  const orders = ordersResult.rows;

  for (const order of orders) {
    const itemsResult = await pool.query(
      `
      SELECT
        id,
        product_id,
        product_name,
        price,
        quantity,
        subtotal,
        created_at
      FROM order_items
      WHERE order_id = $1
      ORDER BY created_at ASC
      `,
      [order.id],
    );

    order.items = itemsResult.rows;
  }

  return orders;
};


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

export const updateOrderStatus = async (
  orderId: string,
  status: string,
) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET
      status = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING
      id,
      user_id,
      total_amount,
      status,
      payment_status,
      paystack_reference,
      created_at,
      updated_at
    `,
    [status, orderId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};


// =====================================================
// CREATE PENDING ORDER + INITIALIZE PAYSTACK
// =====================================================

export const createPendingOrderFromLocalCart = async (
  userId: string,
  items: { productId: string; quantity: number }[],
) => {
  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // -----------------------------------------------
    // GET USER EMAIL
    // -----------------------------------------------

    const userResult = await client.query(
      `
      SELECT email
      FROM users
      WHERE id = $1
      `,
      [userId],
    );

    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }

    const email = userResult.rows[0].email;

    // -----------------------------------------------
    // GET PRODUCTS
    // -----------------------------------------------

    const productIds = items.map(
      (item) => item.productId,
    );

    const result = await client.query(
      `
      SELECT
        id,
        name,
        price,
        stock,
        is_active
      FROM products
      WHERE id = ANY($1::uuid[])
      `,
      [productIds],
    );

    if (result.rows.length !== items.length) {
      throw new Error(
        "One or more products are no longer available",
      );
    }

    // -----------------------------------------------
    // CALCULATE TOTAL
    // -----------------------------------------------

    let totalAmount = 0;

    const orderItems: {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const product = result.rows.find(
        (row) => row.id === item.productId,
      );

      if (!product) {
        throw new Error("Product not found");
      }

      if (!product.is_active) {
        throw new Error(
          `${product.name} is no longer available`,
        );
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        throw new Error(
          `Invalid quantity for ${product.name}`,
        );
      }

     
     if (item.quantity > product.stock) {
      throw new Error(
        `Insufficient stock for ${product.name}. ` +
        `Available: ${product.stock}, ` +
        `Required: ${item.quantity}`,
      );
    }

      const price = Number(product.price);
      const quantity = Number(item.quantity);
      const subtotal = price * quantity;

      totalAmount += subtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        price,
        quantity,
        subtotal,
      });
    }

    console.log("===== PAYSTACK ORDER DEBUG =====");
    console.log("User ID:", userId);
    console.log("Email:", email);
    console.log("Total in NGN:", totalAmount);
    console.log(
      "Amount sent to Paystack:",
      Math.round(totalAmount * 100),
    );
    console.log("================================");

    // -----------------------------------------------
    // CREATE LOCAL ORDER
    // -----------------------------------------------

    const orderResult = await client.query(
      `
      INSERT INTO orders (
        user_id,
        total_amount,
        status,
        payment_status
      )
      VALUES (
        $1,
        $2,
        'Pending',
        'Pending'
      )
      RETURNING
        id,
        user_id,
        total_amount,
        status,
        payment_status,
        created_at,
        updated_at
      `,
      [userId, totalAmount],
    );

    const order = orderResult.rows[0];

    // -----------------------------------------------
    // CREATE ORDER ITEMS
    // -----------------------------------------------

    for (const item of orderItems) {
      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          price,
          quantity,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          order.id,
          item.productId,
          item.productName,
          item.price,
          item.quantity,
          item.subtotal,
        ],
      );
    }

    await client.query("COMMIT");

    // -----------------------------------------------
    // PAYSTACK INITIALIZATION
    // -----------------------------------------------

    const amountInKobo = Math.round(
      totalAmount * 100,
    );

    try {
      const paystackResponse = await paystack.post(
        "/transaction/initialize",
        {
          email,
          amount: amountInKobo,
          currency: "NGN",

          // Our local order ID is unique.
          reference: order.id,

          metadata: {
            userId,
            orderId: order.id,
          },
        },
      );

      if (!paystackResponse.data.status) {
        throw new Error(
          "Paystack transaction initialization failed",
        );
      }

      const paymentData = paystackResponse.data.data;

      // ---------------------------------------------
      // SAVE PAYSTACK REFERENCE
      // ---------------------------------------------

      await pool.query(
        `
        UPDATE orders
        SET
          paystack_reference = $1,
          updated_at = NOW()
        WHERE id = $2
        `,
        [paymentData.reference, order.id],
      );

      console.log(
        "Paystack Reference:",
        paymentData.reference,
      );

      console.log(
        "Paystack Access Code:",
        paymentData.access_code,
      );

      return {
        order: {
          ...order,
          paystack_reference: paymentData.reference,
        },

        paystack: {
          reference: paymentData.reference,
          access_code: paymentData.access_code,
          authorization_url:
            paymentData.authorization_url,
        },
      };
    } catch (paystackError: any) {
      console.error(
        "Paystack transaction initialization failed:",
        paystackError.response?.data ||
          paystackError.message ||
          paystackError,
      );

      await pool.query(
        `
        UPDATE orders
        SET
          status = 'Cancelled',
          payment_status = 'Failed',
          updated_at = NOW()
        WHERE id = $1
        `,
        [order.id],
      );

      throw new Error(
        "Payment could not be started. Please try again.",
      );
    }
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {}

    throw error;
  } finally {
    client.release();
  }
};


// =====================================================
// VERIFY PAYSTACK PAYMENT
// =====================================================

// =====================================================
// VERIFY PAYSTACK PAYMENT
// =====================================================

export const verifyPaystackPayment = async (
  userId: string,
  reference: string,
) => {
  // -----------------------------------------------
  // GET LOCAL ORDER
  // -----------------------------------------------

  const orderResult = await pool.query(
    `
    SELECT
      id,
      user_id,
      total_amount,
      status,
      payment_status,
      paystack_reference
    FROM orders
    WHERE paystack_reference = $1
      AND user_id = $2
    `,
    [reference, userId],
  );

  if (orderResult.rows.length === 0) {
    throw new Error("Order not found");
  }

  const order = orderResult.rows[0];

    // -----------------------------------------------
  // ALREADY PAID?
  // -----------------------------------------------

  if (
    order.payment_status === "Paid" &&
    order.status === "Confirmed"
  ) {
    console.log(
      `Payment already verified for order: ${order.id}`,
    );

    return {
      success: true,
      message: "Payment already verified",
      order,
    };
  }

  // -----------------------------------------------
  // VERIFY PAYMENT WITH PAYSTACK
  // -----------------------------------------------

  const response = await paystack.get(
    `/transaction/verify/${reference}`,
  );

  const payment = response.data.data;

  // -----------------------------------------------
  // VERIFY STATUS
  // -----------------------------------------------

  if (payment.status !== "success") {
    await pool.query(
      `
      UPDATE orders
      SET
        payment_status = 'Failed',
        updated_at = NOW()
      WHERE id = $1
      `,
      [order.id],
    );

    return {
      success: false,
      message: "Payment was not successful",
      paymentStatus: payment.status,
    };
  }

  // -----------------------------------------------
  // VERIFY AMOUNT
  // -----------------------------------------------

  const expectedAmount = Math.round(
    Number(order.total_amount) * 100,
  );

  /*  //------------ FOR TESTING ----------------
  //FOR TESTING MISMATCH AMOUNTS
  /*  
Payment Error
Payment amount does not match order amount
  */
/* const expectedAmount =
  Math.round(Number(order.total_amount) * 100) + 100; */
  /*  //------------ FOR TESTING ----------------

 /*  //------------ FOR TESTING ----------------
  const testAmount = expectedAmount + 100;

console.log("===== AMOUNT VALIDATION TEST =====");
console.log("Expected amount:", expectedAmount);
console.log("Test amount:", testAmount);
console.log("==================================");

if (testAmount !== expectedAmount) {
  throw new Error(
    "Payment amount does not match order amount",
  );
}
  //------------ FOR TESTING ---------------- */

  if (Number(payment.amount) !== expectedAmount) {
    throw new Error(
      "Payment amount does not match order amount",
    );
  }

  // -----------------------------------------------
  // VERIFY CURRENCY
  // -----------------------------------------------

  if (payment.currency !== "NGN") {
    throw new Error(
      "Payment currency does not match order currency",
    );
  }

  // -----------------------------------------------
  // START TRANSACTION
  // -----------------------------------------------

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ---------------------------------------------
    // LOCK ORDER
    // ---------------------------------------------

    const lockedOrderResult = await client.query(
      `
      SELECT
        id,
        user_id,
        total_amount,
        status,
        payment_status,
        paystack_reference
      FROM orders
      WHERE id = $1
        AND user_id = $2
      FOR UPDATE
      `,
      [order.id, userId],
    );

    if (lockedOrderResult.rows.length === 0) {
      throw new Error("Order not found");
    }

    const lockedOrder =
      lockedOrderResult.rows[0];

        // ---------------------------------------------
    // PREVENT DUPLICATE STOCK REDUCTION
    // ---------------------------------------------

    if (
      lockedOrder.payment_status === "Paid" &&
      lockedOrder.status === "Confirmed"
    ) {
      await client.query("COMMIT");

      console.log(
        `Duplicate payment verification prevented: ${lockedOrder.id}`,
      );

      return {
        success: true,
        message: "Payment already verified",
        order: lockedOrder,
      };
    }

    // ---------------------------------------------
    // GET ORDER ITEMS
    // ---------------------------------------------

    const orderItemsResult = await client.query(
      `
      SELECT
        product_id,
        product_name,
        quantity
      FROM order_items
      WHERE order_id = $1
      `,
      [order.id],
    );

    if (orderItemsResult.rows.length === 0) {
      throw new Error("Order has no items");
    }

    // ---------------------------------------------
    // CHECK AND REDUCE STOCK
    // ---------------------------------------------

    for (const item of orderItemsResult.rows) {
      const productResult = await client.query(
        `
        SELECT
          id,
          name,
          stock
        FROM products
        WHERE id = $1
        FOR UPDATE
        `,
        [item.product_id],
      );

      if (productResult.rows.length === 0) {
        throw new Error(
          `Product no longer exists: ${item.product_name}`,
        );
      }

      const product = productResult.rows[0];

      // Check stock again while holding the lock
      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. ` +
          `Available: ${product.stock}, ` +
          `Required: ${item.quantity}`,
        );
      }

      // Reduce stock
      await client.query(
        `
        UPDATE products
        SET
          stock = stock - $1,
          updated_at = NOW()
        WHERE id = $2
        `,
        [
          item.quantity,
          item.product_id,
        ],
      );

      console.log(
        `Stock reduced: ${product.name} ` +
        `${product.stock} -> ` +
        `${product.stock - item.quantity}`,
      );
    }

    // ---------------------------------------------
    // MARK ORDER AS PAID + CONFIRMED
    // ---------------------------------------------

    const updateResult = await client.query(
      `
      UPDATE orders
      SET
        payment_status = 'Paid',
        status = 'Confirmed',
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        user_id,
        total_amount,
        status,
        payment_status,
        paystack_reference,
        created_at,
        updated_at
      `,
      [order.id],
    );

    // ---------------------------------------------
    // COMMIT
    // ---------------------------------------------

    await client.query("COMMIT");

    // ---------------------------------------------
    // SUCCESS
    // ---------------------------------------------

    return {
      success: true,
      message: "Payment verified successfully",
      order: updateResult.rows[0],
      payment,
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;

  } finally {
    client.release();
  }
};


// =====================================================
// CREATE ORDER FROM ITEMS
// =====================================================

export const createOrderFromItems = async (
  userId: string,
  items: { productId: string; quantity: number }[],
) => {
  if (!items.length) {
    throw new Error("Cart is empty");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let total = 0;

    const orderItems: {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const result = await client.query(
        `
        SELECT
          id,
          name,
          price,
          stock
        FROM products
        WHERE id = $1
          AND is_active = true
        `,
        [item.productId],
      );

      if (!result.rows.length) {
        throw new Error("Product not found");
      }

      const product = result.rows[0];

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}`,
        );
      }

      const price = Number(product.price);
      const subtotal = price * item.quantity;

      total += subtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        price,
        quantity: item.quantity,
        subtotal,
      });
    }

    const orderResult = await client.query(
      `
      INSERT INTO orders (
        user_id,
        total_amount
      )
      VALUES ($1, $2)
      RETURNING *
      `,
      [userId, total],
    );

    const order = orderResult.rows[0];

    for (const item of orderItems) {
      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          price,
          quantity,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          order.id,
          item.productId,
          item.productName,
          item.price,
          item.quantity,
          item.subtotal,
        ],
      );
    }

    await client.query("COMMIT");

    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};