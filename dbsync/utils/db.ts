import postgres from 'postgres'
import { Buffer } from 'buffer'; // Ensure Buffer is available

// Ensure environment variables are set
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Environment variable ${varName} is not set.`);
    throw new Error(`Environment variable ${varName} is not set.`);
  }
});

// Initialize postgres client
const sql = postgres({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER, // Correct key is 'username'
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    types: {
        bytea: {
            to: 17,
            from: [17],
            parse: x => Buffer.from(x, 'binary'),
            serialize: x => x,
        },
    },
});

export default sql