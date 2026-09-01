import { pool } from "../config/db.js";

export const getAllDeliveryPartners = async () => {
  const result = await pool.query(`
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
      created_at,
      updated_at
    FROM delivery_partners
    ORDER BY created_at DESC
  `);

  return result.rows;
};


export const getDeliveryPartnerById = async (
  id: string,
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
      created_at,
      updated_at
    FROM delivery_partners
    WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] || null;
};


export const createDeliveryPartner = async (
  data: {
    full_name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    vehicle_type?: string | null;
    vehicle_number?: string | null;
    license_number?: string | null;
    status?: "active" | "inactive";
    password_hash: string;
  },
) => {
  const result = await pool.query(
    `
    INSERT INTO delivery_partners
    (
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
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING
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
      created_at,
      updated_at
    `,
    [
      data.full_name,
      data.phone,
      data.email || null,
      data.address || null,
      data.city || null,
      data.vehicle_type || null,
      data.vehicle_number || null,
      data.license_number || null,
      data.status || "active",
      data.password_hash,
    ],
  );

  return result.rows[0];
};


export const updateDeliveryPartner = async (
  id: string,
  data: {
    full_name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    vehicle_type?: string | null;
    vehicle_number?: string | null;
    license_number?: string | null;
    status?: "active" | "inactive";
  },
) => {
  const result = await pool.query(
    `
    UPDATE delivery_partners
    SET
      full_name = $1,
      phone = $2,
      email = $3,
      address = $4,
      city = $5,
      vehicle_type = $6,
      vehicle_number = $7,
      license_number = $8,
      status = $9,
      updated_at = NOW()
    WHERE id = $10
    RETURNING *
    `,
    [
      data.full_name,
      data.phone,
      data.email || null,
      data.address || null,
      data.city || null,
      data.vehicle_type || null,
      data.vehicle_number || null,
      data.license_number || null,
      data.status || "active",
      id,
    ],
  );

  return result.rows[0] || null;
};


export const deleteDeliveryPartner = async (
  id: string,
) => {
  const result = await pool.query(
    `
    DELETE FROM delivery_partners
    WHERE id = $1
    RETURNING id
    `,
    [id],
  );

  return result.rows[0] || null;
};