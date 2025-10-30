
import db from '../config/db.js'
async function createCollateralTable(){
  await db.query(`
    CREATE TABLE IF NOT EXISTS collateral (
      collateral_id INT AUTO_INCREMENT PRIMARY KEY,
      loan_id INT NOT NULL,
      collateral_type VARCHAR(100) NOT NULL,
      collateral_status VARCHAR(50) DEFAULT 'ACTIVE',
      description VARCHAR(255),
      estimated_value DECIMAL(15,2),
      FOREIGN KEY (loan_id) REFERENCES loan(loan_id) ON DELETE CASCADE
    )
  `);
  console.log('collateral table created successfully');
}
createCollateralTable().catch(e=>console.log(e));
