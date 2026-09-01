import { pool } from "../config/db.js";

export const addTrackingPoint = async (
  partnerId: string,
  orderId: string,
  latitude: number,
  longitude: number,
) => {
  const result = await pool.query(
    `
    INSERT INTO delivery_tracking_points
    (
      order_id,
      latitude,
      longitude
    )
    SELECT
      o.id,
      $3,
      $4
    FROM orders o
    WHERE o.id = $2
      AND o.delivery_partner_id = $1
      AND o.status = 'OutForDelivery'
    RETURNING
      id,
      order_id,
      latitude,
      longitude,
      recorded_at
    `,
    [
      partnerId,
      orderId,
      latitude,
      longitude,
    ],
  );

  return result.rows[0] || null;
};

/* export const getTrackingPoints = async (
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
    WHERE dtp.order_id = $1
      AND o.delivery_partner_id = $2
    ORDER BY dtp.recorded_at ASC
    `,
    [orderId, partnerId],
  );

  return result.rows;
}; */
export const getTrackingData = async (
  partnerId: string,
  orderId: string,
) => {
  const result = await pool.query(
    `
    SELECT
      o.id,
      o.status,

      COALESCE(
        json_agg(
          json_build_object(
            'id', dtp.id,
            'order_id', dtp.order_id,
            'latitude', dtp.latitude,
            'longitude', dtp.longitude,
            'recorded_at', dtp.recorded_at
          )
          ORDER BY dtp.recorded_at ASC
        ) FILTER (WHERE dtp.id IS NOT NULL),
        '[]'
      ) AS points

    FROM orders o

    LEFT JOIN delivery_tracking_points dtp
      ON dtp.order_id = o.id

    WHERE
      o.id = $1
      AND o.delivery_partner_id = $2

    GROUP BY
      o.id,
      o.status
    `,
    [orderId, partnerId],
  );

  return result.rows[0] || null;
};