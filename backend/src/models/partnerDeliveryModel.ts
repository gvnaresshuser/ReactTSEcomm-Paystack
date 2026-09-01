import { pool } from "../config/db.js";

export const getPartnerDeliveries = async (
  partnerId: string,
) => {
  const result = await pool.query(
    `
    SELECT
      o.id,
      o.user_id,
      u.name AS customer_name,
      u.email AS customer_email,

      o.total_amount,
      o.status,
      o.payment_status,
      o.payment_method,
      o.paystack_reference,

      o.delivery_partner_id,

      o.created_at,
      o.updated_at

    FROM orders o

    JOIN users u
      ON u.id = o.user_id

    WHERE o.delivery_partner_id = $1

    ORDER BY o.created_at DESC
    `,
    [partnerId],
  );

  return result.rows;
};

export const startPartnerDelivery = async (
  partnerId: string,
  orderId: string,
) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET
      status = 'OutForDelivery',
      updated_at = NOW()
    WHERE id = $1
      AND delivery_partner_id = $2
      AND status IN ('Pending', 'Confirmed', 'Packed')
    RETURNING
      id,
      status,
      delivery_partner_id,
      updated_at
    `,
    [orderId, partnerId],
  );

  return result.rows[0] || null;
};
export const completePartnerDelivery = async (
  partnerId: string,
  orderId: string,
) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET
      status = 'Delivered',
      updated_at = NOW()
    WHERE
      id = $1
      AND delivery_partner_id = $2
      AND status = 'OutForDelivery'
    RETURNING
      id,
      user_id,
      total_amount,
      status,
      payment_status,
      delivery_partner_id,
      created_at,
      updated_at
    `,
    [orderId, partnerId],
  );

  return result.rows[0] || null;
};

export const getPartnerTrackingPoints = async (
  partnerId: string,
  orderId: string,
) => {
  const result = await pool.query(
    `
    SELECT
      dtp.id,
      dtp.order_id,
      dtp.latitude,
      dtp.longitude,
      dtp.recorded_at

    FROM delivery_tracking_points dtp

    JOIN orders o
      ON o.id = dtp.order_id

    WHERE
      dtp.order_id = $1
      AND o.delivery_partner_id = $2

    ORDER BY dtp.recorded_at ASC
    `,
    [orderId, partnerId],
  );

  return result.rows;
};