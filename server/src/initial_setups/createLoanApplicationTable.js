

import db from '../config/db.js';


async function createLoanApplicationTable(){
     await db.query(`
    CREATE TABLE loan_application (
  loan_application_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NULL,
  group_id INT NULL,
  product_id INT NOT NULL,
  branch_id INT NOT NULL,
  amount_applied DECIMAL(15,2) NOT NULL,
  tenure_months INT NOT NULL,
  application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Pending',
  guarantor_id INT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL,
  FOREIGN KEY (group_id) REFERENCES \`group\`(group_id) ON DELETE SET NULL,
  FOREIGN KEY (product_id) REFERENCES loan_product(product_id) ON DELETE CASCADE,
  FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE,
  FOREIGN KEY (guarantor_id) REFERENCES guarantor(guarantor_id) ON DELETE SET NULL
);

);

        `)
    console.log('loan_application table created successfully');
}


createLoanApplicationTable().catch(e=>{
    console.log('some error occured while attempting to create loan application table');
})