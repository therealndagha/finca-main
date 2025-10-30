import db from '../config/db.js'

async function createLoanRepaymentTable(){
  await db.query(`
    CREATE TABLE IF NOT EXISTS loan_repayment (
      repayment_id INT AUTO_INCREMENT PRIMARY KEY,
      loan_id INT NOT NULL,
      repayment_date DATE NOT NULL,
      amount_paid DECIMAL(15,2) NOT NULL,
      balance DECIMAL(15, 2) NOT NULL,
      payment_method_id INT NOT NULL,
      FOREIGN KEY (loan_id) REFERENCES loan(loan_id) ON DELETE CASCADE,
      FOREIGN KEY(payment_method_id) REFERENCES payment_method(method_id) ON DELETE CASCADE
    )
  `);
  console.log('loan_repayment table created successfully');
}
createLoanRepaymentTable().catch(e=>console.log(e));
