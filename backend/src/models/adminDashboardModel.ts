import { pool } from "../config/db.js";

export const getAdminDashboard = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM products) AS total_products,

      (SELECT COUNT(*)
       FROM orders) AS total_orders,

      (SELECT COUNT(*)
       FROM orders
       WHERE status = 'Pending'
       AND payment_status = 'Pending') AS pending_orders,

      (SELECT COUNT(*)
       FROM orders
       WHERE payment_status = 'Paid') AS paid_orders,

      (SELECT COALESCE(SUM(total_amount), 0)
       FROM orders
       WHERE payment_status = 'Paid'
       AND status <> 'Cancelled') AS total_sales
  `);

  return result.rows[0];
};