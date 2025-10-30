import db from '../config/db.js'
async function createLoanInsuranceTable(){
  await db.query(`
    CREATE TABLE IF NOT EXISTS loan_insurance (
      insurance_id INT AUTO_INCREMENT PRIMARY KEY,
      loan_id INT NOT NULL,
      provider_name VARCHAR(100) NOT NULL,
      policy_number VARCHAR(100),
      coverage_amount DECIMAL(15,2),
      FOREIGN KEY (loan_id) REFERENCES loan(loan_id) ON DELETE CASCADE
    )
  `);
  console.log('loan_insurance table created successfully');
}
createLoanInsuranceTable().catch(e=>console.log(e));
