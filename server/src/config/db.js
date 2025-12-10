

import mysql from 'mysql2/promise'; // promise API from mysql2

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'ndagha2002',
  database: process.env.DATABASE_NAME || 'finca_testdb'
});

export default pool;
