import db from '../config/db.js';

async function createPaymentMethodTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS payment_method (
      method_id INT AUTO_INCREMENT PRIMARY KEY,
      method_name VARCHAR(50) NOT NULL UNIQUE,
      description VARCHAR(255)
    )
  `);
  console.log('payment_method table created successfully');
}

createPaymentMethodTable().catch(e => {
  console.log('Error creating payment_method table:', e);
});
