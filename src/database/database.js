import pg from 'pg';
import env from "dotenv"
env.config()

const { Pool } = pg;

const connection = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT_SERVER,
    database: process.env.DATABASE
});

export default connection;