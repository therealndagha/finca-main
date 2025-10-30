import db from '../config/db.js'

async function createLoanDisbursementTable(){
  await db.query(`
    CREATE TABLE IF NOT EXISTS loan_disbursement (
      disbursement_id INT AUTO_INCREMENT PRIMARY KEY,
      loan_id INT NOT NULL,
      disbursed_by INT NOT NULL,
      disbursement_date DATE NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      disbursement_method_id INT NOT NULL,
      FOREIGN KEY (loan_id) REFERENCES loan(loan_id) ON DELETE CASCADE,
      FOREIGN KEY(disbursed_by) REFERENCES staff(staff_id) ON DELETE CASCADE,
      FOREIGN KEY(disbursement_method_id) REFERENCES payment_method(method_id) ON DELETE CASCADE
    )
  `);
  console.log('loan_disbursement table created successfully');
}
createLoanDisbursementTable().catch(e=>console.log(e));
