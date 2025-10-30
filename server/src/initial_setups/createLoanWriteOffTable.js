import db from '../config/db.js'
async function createLoanWriteoffTable(){
  await db.query(`
    CREATE TABLE loan_writeoff (
      writeoff_id INT AUTO_INCREMENT PRIMARY KEY,
      loan_id INT NOT NULL,
      writeoff_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      reason VARCHAR(255) NOT NULL,
      amount_written_off DECIMAL(15,2) NOT NULL,
      FOREIGN KEY (loan_id) REFERENCES loan(loan_id) ON DELETE CASCADE
    )
  `);
  console.log('loan_writeoff table created successfully');
}

createLoanWriteoffTable().catch(e=>{
  console.log('Error creating loan writeoff table', e);
});
