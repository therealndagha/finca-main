import db from '../config/db.js';

async function testDatabaseConnection() {
  try {
    const [rows] = await db.query('SHOW TABLES');
    console.log(rows);
  } catch (err) {
    console.error('some error occurred', err);
  }
}

testDatabaseConnection();
