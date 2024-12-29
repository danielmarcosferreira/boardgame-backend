import pg from 'pg';

const { Pool } = pg;

const connection = new Pool({
    user: 'danielmarcos',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'boardgame'
});

export default connection;