import sql from '~/utils/db';
import { Buffer } from 'buffer'; // Ensure Buffer is available

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    // Function to convert buffer to Cardano block hash
    function bufferToCardanoBlockHash(buffer) {
        if (!buffer) {
            return null;
        }
        if (Buffer.isBuffer(buffer)) {
            return buffer.toString('hex');
        } else if (typeof buffer === 'object' && buffer.type === 'Buffer' && Array.isArray(buffer.data)) {
            return Buffer.from(buffer.data).toString('hex');
        } else {
            throw new Error('Invalid buffer format');
        }
    }

    try {
        // Pagination parameters with defaults
        const limit = parseInt(query.limit) || 20;
        const offset = parseInt(query.offset) || 0;

        // Reverse order parameter with default true
        const reverseOrder = query.reverseOrder !== undefined ? query.reverseOrder.toLowerCase() === 'true' : true;

        // Fetch the time of block 1 for time filtering
        const block1TimeResult = await sql`SELECT time FROM block WHERE id = 1`;
        const block1Time = new Date(block1TimeResult[0].time);
        const now = new Date();

        // Allowed filter keys based on table columns
        const allowedFilters = [
            'id', 'epoch_no', 'slot_no', 'epoch_slot_no', 'block_no', 'previous_id', 'size', 
            'tx_count', 'proto_major', 'proto_minor', 'op_cert_counter'
        ];

        const conditions = [];

        // Process each allowed filter, including range-based conditions
        for (const key of allowedFilters) {
            const minKey = `min_${key}`;
            const maxKey = `max_${key}`;

            // Handle exact input values
            if (query[key] !== undefined) {
                const value = parseInt(query[key], 10);
                if (isNaN(value)) throw new Error(`Invalid value for ${key}: Must be a number.`);
                conditions.push(`${key} = ${value}`);
            }

            // Handle min/max input values
            if (query[minKey] !== undefined) {
                const minValue = parseInt(query[minKey], 10);
                if (isNaN(minValue)) throw new Error(`Invalid value for ${minKey}: Must be a number.`);
                conditions.push(`${key} >= ${minValue}`);
            }

            if (query[maxKey] !== undefined) {
                const maxValue = parseInt(query[maxKey], 10);
                if (isNaN(maxValue)) throw new Error(`Invalid value for ${maxKey}: Must be a number.`);
                conditions.push(`${key} <= ${maxValue}`);
            }
        }

        // Handle time ranges
        if (query.min_time) {
            const minTime = new Date(query.min_time);
            if (isNaN(minTime.getTime())) throw new Error(`Invalid date for min_time`);
            conditions.push(`time >= '${minTime.toISOString()}'`);
        }

        if (query.max_time) {
            const maxTime = new Date(query.max_time);
            if (isNaN(maxTime.getTime())) throw new Error(`Invalid date for max_time`);
            conditions.push(`time <= '${maxTime.toISOString()}'`);
        }

        // Build WHERE clause as plain string
        let whereClause = '';
        if (conditions.length > 0) {
            whereClause = `WHERE ${conditions.join(' AND ')}`;
        }

        // Determine ORDER BY clause based on reverseOrder parameter
        const orderClause = reverseOrder ? 'ORDER BY id DESC' : 'ORDER BY id ASC';

        // Build final SQL query as a string
        const queryString = `
            SELECT * FROM block
            ${whereClause}
            ${orderClause}
            LIMIT ${limit} OFFSET ${offset};
        `;

        // Execute the query as a string
        const blocks = await sql.unsafe(queryString);

        // Convert 'hash' and other buffer fields to hex strings
        const processedBlocks = blocks.map(block => {
            try {
                if (block.hash) {
                    block.hash = bufferToCardanoBlockHash(block.hash);
                }
                if (block.op_cert) {
                    block.op_cert = bufferToCardanoBlockHash(block.op_cert);
                }
            } catch (err) {
                console.error(`Error processing block with id ${block.id}:`, err);
                throw err;
            }
            return block;
        });

        return processedBlocks;
    } catch (err) {
        console.error('An error occurred:', err);
        return { error: String(err) || 'An unexpected error occurred' };
    }
});