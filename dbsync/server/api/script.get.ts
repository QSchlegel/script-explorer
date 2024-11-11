import sql from '~/utils/db';
import { defineEventHandler, getQuery } from 'h3';

// Prepare hash for querying by trimming and validating the hex string
function prepareHashForQuery(hash) {
    if (typeof hash !== 'string' || !/^[0-9a-fA-F]+$/.test(hash)) {
        throw new Error('Invalid hex string format');
    }
    // Trim to 64 characters if needed
    return hash.length === 80 ? hash.slice(0, 64) : hash;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    // Pagination parameters with defaults
    const limit = parseInt(query.limit) || 20;
    const offset = parseInt(query.offset) || 0;

    // Set the ordering direction
    let orderBy = 'DESC';
    if (query.order && query.order.toLowerCase() === 'asc') {
      orderBy = 'ASC';
    }

    // Initialize WHERE conditions and parameterized values
    const conditions = [];
    const values = [];

    // Define filters for script columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      tx_id: { single: query.tx_id, min: query.min_tx_id, max: query.max_tx_id },
      hash: { single: query.hash }
    };

    // Add conditions for filters
    for (const [field, range] of Object.entries(filters)) {
      if (range.single !== undefined) {
        if (field === 'hash') {
          const preparedHash = prepareHashForQuery(range.single);
          conditions.push(`${field} = decode($${conditions.length + 1}, 'hex')`);
          values.push(preparedHash);
        } else {
          const singleValue = parseInt(range.single, 10);
          if (!isNaN(singleValue)) {
            conditions.push(`${field} = $${conditions.length + 1}`);
            values.push(singleValue);
          }
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
      SELECT id, tx_id, encode(hash, 'hex') AS hash, type, json, encode(bytes, 'hex') AS bytes, serialised_size
      FROM script
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    // Execute the query
    const scripts = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results, parsing JSON fields
    return scripts.map(script => ({
      ...script,
      json: script.json ? JSON.stringify(script.json, null, 2) : null
    }));
  } catch (err) {
    console.error('Error in /api/script:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});