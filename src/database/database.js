import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Use SSL only in production
});

export default connection;