import { pool } from "../config/db.js";

export const getAllOrdersAdmin = async () => {
  const result = await pool.query(`
    SELECT
      o.id,
      o.user_id,
      u.name AS user_name,
      u.email AS user_email,
      o.total_amount,
      o.status,
      o.payment_method,
      o.payment_status,
      o.paystack_reference,

      o.delivery_partner_id,
      dp.full_name AS delivery_partner_name,
      dp.phone AS delivery_partner_phone,

      o.created_at,
      o.updated_at
    FROM orders o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN delivery_partners dp
      ON dp.id = o.delivery_partner_id
    ORDER BY o.created_at DESC
  `);

  return result.rows;
};

export const getOrderByIdAdmin = async (
  orderId: string,
) => {
  const orderResult = await pool.query(
    `
    SELECT
      o.id,
      o.user_id,
      u.name AS user_name,
      u.email AS user_email,
      o.total_amount,
      o.status,
      o.payment_method,
      o.payment_status,
      o.paystack_reference,

      o.delivery_partner_id,
      dp.full_name AS delivery_partner_name,
      dp.phone AS delivery_partner_phone,

      o.created_at,
      o.updated_at
    FROM orders o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN delivery_partners dp
      ON dp.id = o.delivery_partner_id
    WHERE o.id = $1
    `,
    [orderId],
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const itemsResult = await pool.query(
    `
    SELECT
      id,
      product_id,
      product_name,
      price,
      quantity,
      subtotal
    FROM order_items
    WHERE order_id = $1
    ORDER BY created_at
    `,
    [orderId],
  );

  return {
    ...orderResult.rows[0],
    items: itemsResult.rows,
  };
};

export const updateOrderStatusAdmin = async (
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
      created_at,
      updated_at
    `,
    [status, orderId],
  );

  return result.rows[0] || null;
};

export const assignDeliveryPartner = async (
  orderId: string,
  partnerId: string,
) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET
      delivery_partner_id = $1,
      updated_at = NOW()
    WHERE
      id = $2
      AND (
        payment_method = 'COD'
        OR payment_status = 'Paid'
      )
    RETURNING
      id,
      delivery_partner_id,
      status,
      payment_method,
      payment_status,
      updated_at
    `,
    [partnerId, orderId],
  );

  return result.rows[0] || null;
};


export const removeDeliveryPartner = async (
  orderId: string,
) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET
      delivery_partner_id = NULL,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      delivery_partner_id,
      status,
      updated_at
    `,
    [orderId],
  );

  return result.rows[0] || null;
};

export const getPaginatedOrdersAdmin = async (
  page: number,
  limit: number,
  search: string,
  fromDateTime?: string,
  toDateTime?: string,
) => {
  const offset = (page - 1) * limit;

  const values: string[] = [];
  const conditions: string[] = [];

  // ================================
  // SEARCH
  // ================================
  if (search) {
    values.push(`%${search}%`);

    conditions.push(`
      (
        u.name ILIKE $${values.length}
        OR u.email ILIKE $${values.length}
        OR o.id::text ILIKE $${values.length}
        OR o.status ILIKE $${values.length}
        OR o.payment_status ILIKE $${values.length}
        OR o.payment_method ILIKE $${values.length}
        OR o.paystack_reference ILIKE $${values.length}
        OR dp.full_name ILIKE $${values.length}
        OR dp.phone ILIKE $${values.length}
      )
    `);
  }

  // ================================
  // FROM DATE/TIME
  // ================================
  if (fromDateTime) {
    values.push(fromDateTime);

    conditions.push(
      `o.created_at >= $${values.length}`,
    );
  }

  // ================================
  // TO DATE/TIME
  // ================================
  if (toDateTime) {
    values.push(toDateTime);

    conditions.push(
      `o.created_at <= $${values.length}`,
    );
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  // ================================
  // TOTAL COUNT
  // ================================
  const countResult = await pool.query(
    `
    SELECT COUNT(*) AS total

    FROM orders o

    JOIN users u
      ON u.id = o.user_id

    LEFT JOIN delivery_partners dp
      ON dp.id = o.delivery_partner_id

    ${whereClause}
    `,
    values,
  );

  const totalOrders = Number(
    countResult.rows[0].total,
  );

  // ================================
  // PAGINATED ORDERS
  // ================================
  const dataValues = [
    ...values,
    limit,
    offset,
  ];

  const result = await pool.query(
    `
    SELECT
      o.id,
      o.user_id,

      u.name AS user_name,
      u.email AS user_email,

      o.total_amount,
      o.status,
      o.payment_method,
      o.payment_status,
      o.paystack_reference,

      o.delivery_partner_id,
      dp.full_name AS delivery_partner_name,
      dp.phone AS delivery_partner_phone,

      o.created_at,
      o.updated_at

    FROM orders o

    JOIN users u
      ON u.id = o.user_id

    LEFT JOIN delivery_partners dp
      ON dp.id = o.delivery_partner_id

    ${whereClause}

    ORDER BY
      o.created_at DESC,
      o.id DESC

    LIMIT $${dataValues.length - 1}
    OFFSET $${dataValues.length}
    `,
    dataValues,
  );

  return {
    orders: result.rows,
    totalOrders,
  };
};