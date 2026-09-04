import {pool} from "../config/db.js";

interface GetProductsParams {
  page: number;
  limit: number;
  search: string;
  category: string;
}

interface ProductPaginationResult {
  products: unknown[];
  totalProducts: number;
}

export const getProductsPaginated = async ({
  page,
  limit,
  search,
  category,
}: GetProductsParams): Promise<ProductPaginationResult> => {
  const offset = (page - 1) * limit;

  const values: (string | number)[] = [];
  let conditions = "";

  // SEARCH
  if (search) {
    values.push(`%${search}%`);

    conditions += `
      AND (
        name ILIKE $${values.length}
        OR description ILIKE $${values.length}
      )
    `;
  }

  // CATEGORY
  if (category && category !== "All") {
    values.push(category);

    conditions += `
      AND category = $${values.length}
    `;
  }

  // TOTAL PRODUCTS
  const countQuery = `
    SELECT COUNT(*) AS count
    FROM products
    WHERE 1 = 1
    ${conditions}
  `;

  const countResult = await pool.query(countQuery, values);

  const totalProducts = Number(countResult.rows[0].count);

  // PRODUCTS
  values.push(limit);
  values.push(offset);

  const productsQuery = `
    SELECT *
    FROM products
    WHERE 1 = 1
    ${conditions}
    ORDER BY created_at DESC
    LIMIT $${values.length - 1}
    OFFSET $${values.length}
  `;

  const productsResult = await pool.query(productsQuery, values);

  return {
    products: productsResult.rows,
    totalProducts,
  };
};