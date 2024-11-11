import sql from '~/utils/db';
import { Buffer } from 'buffer'; // Ensure Buffer is available

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    // Pagination parameters with defaults
    const limit = parseInt(query.limit) || 20;
    const offset = parseInt(query.offset) || 0;

    // Determine order parameter, defaulting to DESC if not provided
    let orderBy = 'DESC';
    if (query.order && query.order.toLowerCase() === 'asc') {
      orderBy = 'ASC';
    } else if (query.order && query.order.toLowerCase() === 'desc') {
      orderBy = 'DESC';
    }

    // Initialize the conditions array for the WHERE clause and the values array for parameterized queries
    const conditions = [];
    const values = [];

    // Handle both single-value and range-based filters
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      block_id: { single: query.block_id, min: query.min_block_id, max: query.max_block_id },
      block_index: { single: query.block_index, min: query.min_block_index, max: query.max_block_index },
      out_sum: { min: query.min_out_sum, max: query.max_out_sum },
      fee: { min: query.min_fee, max: query.max_fee },
      size: { min: query.min_size, max: query.max_size },
      script_size: { min: query.min_script_size, max: query.max_script_size }
    };

    // Loop through filters to add WHERE conditions for both single and range-based filters
    for (const [field, range] of Object.entries(filters)) {
      // Single-value filtering (e.g., id=123)
      if (range.single !== undefined) {
        const singleValue = parseInt(range.single, 10);
        if (!isNaN(singleValue)) {
          conditions.push(`${field} = $${conditions.length + 1}`);
          values.push(singleValue);
        }
      }

      // Range-based filtering (e.g., min_id=10 and max_id=50)
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

    // Handle hash filter (convert to buffer)
    if (query.hash) {
      try {
        const hashBuffer = Buffer.from(query.hash, 'hex'); // Convert hash string to buffer
        conditions.push(`hash = $${conditions.length + 1}`);
        values.push(hashBuffer);
      } catch (err) {
        throw new Error('Invalid hash format. Must be a hex string.');
      }
    }

    // Handle boolean fields like valid_contract
    if (query.valid_contract !== undefined) {
      const validContract = query.valid_contract.toLowerCase() === 'true';
      conditions.push(`valid_contract = $${conditions.length + 1}`);
      values.push(validContract);
    }

    // Handle time fields like invalid_before and invalid_hereafter
    if (query.invalid_before) {
      const invalidBefore = parseInt(query.invalid_before, 10);
      if (!isNaN(invalidBefore)) {
        conditions.push(`invalid_before = $${conditions.length + 1}`);
        values.push(invalidBefore);
      }
    }

    if (query.invalid_hereafter) {
      const invalidHereafter = parseInt(query.invalid_hereafter, 10);
      if (!isNaN(invalidHereafter)) {
        conditions.push(`invalid_hereafter = $${conditions.length + 1}`);
        values.push(invalidHereafter);
      }
    }

    // Build WHERE clause from the conditions array
    let whereClause = '';
    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // Final SQL query with the ORDER BY clause
    const queryString = `
      SELECT * FROM tx
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    // Execute the query
    const transactions = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return transactions, converting buffer fields to hex string
    return transactions.map(tx => ({
      ...tx,
      hash: tx.hash ? Buffer.from(tx.hash).toString('hex') : null, // Convert hash back to hex string
    }));
  } catch (err) {
    console.error('Error in /api/tx:', err);
    return { error: err.message || 'An unexpected error occurred' };
  }
});