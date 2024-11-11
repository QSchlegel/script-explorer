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

    // Define filters for meta columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      start_time: { single: query.start_time, min: query.min_start_time, max: query.max_start_time },
      network_name: { single: query.network_name },
      version: { single: query.version }
    };

    // Add conditions for single-value and range-based filters
    for (const [field, range] of Object.entries(filters)) {
      if (range.single !== undefined) {
        if (field === 'start_time') {
          conditions.push(`${field} = $${conditions.length + 1}`);
          values.push(new Date(range.single));
        } else {
          conditions.push(`${field} = $${conditions.length + 1}`);
          values.push(range.single);
        }
      }
      if (range.min !== undefined) {
        if (field === 'start_time') {
          conditions.push(`${field} >= $${conditions.length + 1}`);
          values.push(new Date(range.min));
        } else {
          const minValue = parseInt(range.min, 10);
          if (!isNaN(minValue)) {
            conditions.push(`${field} >= $${conditions.length + 1}`);
            values.push(minValue);
          }
        }
      }
      if (range.max !== undefined) {
        if (field === 'start_time') {
          conditions.push(`${field} <= $${conditions.length + 1}`);
          values.push(new Date(range.max));
        } else {
          const maxValue = parseInt(range.max, 10);
          if (!isNaN(maxValue)) {
            conditions.push(`${field} <= $${conditions.length + 1}`);
            values.push(maxValue);
          }
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
      SELECT id, start_time, network_name, version
      FROM meta
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const metaRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return metaRecords;
  } catch (err) {
    console.error('Error in /api/meta:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});