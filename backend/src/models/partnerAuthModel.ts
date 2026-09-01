import {pool} from "../config/db.js";

export const getPartnerByPhone = async (
  phone: string,
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      full_name,
      phone,
      email,
      address,
      city,
      vehicle_type,
      vehicle_number,
      license_number,
      status,
      password_hash
    FROM delivery_partners
    WHERE phone = $1
    LIMIT 1
    `,
    [phone],
  );

  return result.rows[0] || null;
};