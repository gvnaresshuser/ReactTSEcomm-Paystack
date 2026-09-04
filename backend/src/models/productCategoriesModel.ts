import {pool} from "../config/db.js";

export const getProductCategories = async (): Promise<string[]> => {
  const query = `
    SELECT DISTINCT category
    FROM products
    WHERE category IS NOT NULL
      AND TRIM(category) <> ''
    ORDER BY category ASC
  `;

  const result = await pool.query(query);

  return result.rows.map(
    (row: { category: string }) => row.category,
  );
};