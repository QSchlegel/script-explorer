import sql from '~/utils/db';
import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    // Pagination parameters with defaults
    const limit = parseInt(query.limit) || 20;
    const offset = parseInt(query.offset) || 0;

    // Set the ordering direction, defaulting to DESC
    let orderBy = 'DESC';
    if (query.order && query.order.toLowerCase() === 'asc') {
      orderBy = 'ASC';
    }

    // Initialize conditions array for WHERE clause and values array for parameterized queries
    const conditions = [];
    const values = [];

    // Define filters for tx_metadata columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      key: { single: query.key, min: query.min_key, max: query.max_key },
      tx_id: { single: query.tx_id, min: query.min_tx_id, max: query.max_tx_id }
    };

    // Add conditions for single-value and range-based filters
    for (const [field, range] of Object.entries(filters)) {
      if (range.single !== undefined) {
        const singleValue = parseInt(range.single, 10);
        if (!isNaN(singleValue)) {
          conditions.push(`${field} = $${conditions.length + 1}`);
          values.push(singleValue);
        }
      }
      if (range.min !== undefined) {
        const minValue = parseInt(range.min, 10);
        if (!isNaN(minValue)) {
          conditions.push(`${field} >= $${conditions.length + 1}`);
          values.push(minValue);
        }
      }
      if (range.max !== undefined) {
        const maxValue = parseInt(range.max, 10);
        if (!isNaN(maxValue)) {
          conditions.push(`${field} <= $${conditions.length + 1}`);
          values.push(maxValue);
        }
      }
    }

    // Build WHERE clause
    let whereClause = '';
    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // Final SQL query with ORDER BY clause
    const queryString = `
      SELECT * FROM tx_metadata
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    // Execute the query
    const txMetadata = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return txMetadata.map(metadata => ({
      ...metadata,
      bytes: metadata.bytes ? Buffer.from(metadata.bytes).toString('hex') : null
    }));
  } catch (err) {
    console.error('Error in /api/tx_metadata:', err);
    return { error: err.message || 'An unexpected error occurred' };
  }
});