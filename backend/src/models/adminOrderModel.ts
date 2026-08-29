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
      o.payment_status,
      o.razorpay_order_id,
      o.razorpay_payment_id,
      o.created_at,
      o.updated_at
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
  `);

  return result.rows;
};

export const getOrderByIdAdmin = async (orderId: string) => {
  const orderResult = await pool.query(
    `
    SELECT
      o.id,
      o.user_id,
      u.name AS user_name,
      u.email AS user_email,
      o.total_amount,
      o.status,
      o.payment_status,
      o.razorpay_order_id,
      o.razorpay_payment_id,
      o.created_at,
      o.updated_at
    FROM orders o
    JOIN users u ON u.id = o.user_id
    WHERE o.id = $1
    `,
    [orderId],
  );

  if (orderResult.rows.length === 0) return null;

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