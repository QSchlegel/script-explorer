import sql from '~/utils/db';
import { Buffer } from 'buffer'; // Ensure Buffer is available

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // Log the incoming query parameters
  console.log("Received query parameters:", query);

  try {
    // Pagination parameters with defaults
    const limit = parseInt(query.limit) || 20;
    const offset = parseInt(query.offset) || 0;

    // Log pagination information
    console.log("Pagination - Limit:", limit, "Offset:", offset);

    // Determine order parameter, defaulting to DESC if not provided
    let orderBy = 'DESC';
    if (query.order && query.order.toLowerCase() === 'asc') {
      orderBy = 'ASC';
    } else if (query.order && query.order.toLowerCase() === 'desc') {
      orderBy = 'DESC';
    }

    // Log the order parameter
    console.log("Order by:", orderBy);

    // Initialize the conditions array for the WHERE clause and the values array for parameterized queries
    const conditions = [];
    const values = [];

    // Handle both single-value and range-based filters for tx_out
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      tx_id: { single: query.tx_id, min: query.min_tx_id, max: query.max_tx_id },
      index: { single: query.index, min: query.min_index, max: query.max_index },
      value: { min: query.min_value, max: query.max_value },
      stake_address_id: { single: query.stake_address_id, min: query.min_stake_address_id, max: query.max_stake_address_id }
    };

    // Log filters before processing
    console.log("Filters before processing:", filters);

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

    // Log conditions and values after processing
    console.log("Conditions:", conditions);
    console.log("Values:", values);

    // Handle boolean fields like address_has_script
    if (query.address_has_script !== undefined) {
      const hasScript = query.address_has_script.toLowerCase() === 'true';
      conditions.push(`address_has_script = $${conditions.length + 1}`);
      values.push(hasScript);
    }

    // Handle address filtering
    if (query.address) {
      conditions.push(`address = $${conditions.length + 1}`);
      values.push(query.address);
    }

    // Handle hash-based filters (payment_cred and data_hash)
    if (query.payment_cred) {
      try {
        const paymentCredBuffer = Buffer.from(query.payment_cred, 'hex');
        conditions.push(`payment_cred = $${conditions.length + 1}`);
        values.push(paymentCredBuffer);
      } catch (err) {
        throw new Error('Invalid payment_cred format. Must be a hex string.');
      }
    }

    if (query.data_hash) {
      try {
        const dataHashBuffer = Buffer.from(query.data_hash, 'hex');
        conditions.push(`data_hash = $${conditions.length + 1}`);
        values.push(dataHashBuffer);
      } catch (err) {
        throw new Error('Invalid data_hash format. Must be a hex string.');
      }
    }

    // Build WHERE clause from the conditions array
    let whereClause = '';
    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // Log the WHERE clause
    console.log("WHERE clause:", whereClause);

    // Final SQL query with the ORDER BY clause
    const queryString = `
      SELECT * FROM tx_out
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    // Log the final query and values
    console.log("Final query string:", queryString);
    console.log("Final query values:", values);

    // Execute the query
    const txOuts = await sql.unsafe(queryString, [...values, limit, offset]);

    // Log the query result
    console.log("Query result:", txOuts);

    // Return the results, converting buffer fields to hex string
    return txOuts.map(txOut => ({
      ...txOut,
      payment_cred: txOut.payment_cred ? Buffer.from(txOut.payment_cred).toString('hex') : null,
      data_hash: txOut.data_hash ? Buffer.from(txOut.data_hash).toString('hex') : null,  // Convert data_hash to hex string
      inline_datum_id: txOut.inline_datum_id || null,  // Ensure inline_datum_id is included
      reference_script_id: txOut.reference_script_id || null  // Ensure reference_script_id is included
    }));
  } catch (err) {
    // Log the error message
    console.error('Error in /api/tx_out:', err);
    return { error: err.message || 'An unexpected error occurred' };
  }
});