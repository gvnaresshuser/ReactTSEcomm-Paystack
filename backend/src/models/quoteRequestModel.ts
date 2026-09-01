import { pool } from "../config/db.js";

export interface QuoteRequestData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  shipping?: string;
  shipment_size?: string;
  message: string;
}

export const createQuoteRequest = async (
  data: QuoteRequestData
) => {
  const {
    name,
    email,
    phone,
    company,
    service,
    shipping,
    shipment_size,
    message,
  } = data;

  const result = await pool.query(
    `
      INSERT INTO quote_requests
      (
        name,
        email,
        phone,
        company,
        service,
        shipping,
        shipment_size,
        message
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `,
    [
      name,
      email,
      phone,
      company || null,
      service,
      shipping || null,
      shipment_size || null,
      message,
    ]
  );

  return result.rows[0];
};
export const getAllQuoteRequests = async () => {
  const result = await pool.query(`
    SELECT
      id,
      name,
      email,
      phone,
      company,
      service,
      shipping,
      shipment_size,
      message,
      created_at
    FROM quote_requests
    ORDER BY created_at DESC
  `);

  return result.rows;
};