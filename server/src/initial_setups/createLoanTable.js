import db from '../config/db.js'

async function createLoanTable(){
  await db.query(`
    CREATE TABLE IF NOT EXISTS loan (
      loan_id INT AUTO_INCREMENT PRIMARY KEY,
      loan_application_id INT NOT NULL,
      loan_amount DECIMAL(15,2) NOT NULL,
      staff_id INT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status VARCHAR(50) DEFAULT 'Active',
      FOREIGN KEY (loan_application_id) REFERENCES loan_application(loan_application_id) ON DELETE CASCADE,
      FOREIGN KEY(staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE
    )
  `);
  console.log('loan table created successfully');
}
createLoanTable().catch(e=>console.log(e));
