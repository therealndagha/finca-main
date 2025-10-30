import db from '../config/db.js'

async function createComplaintsTable(){
  await db.query(`
    CREATE TABLE complaints (
      complaint_id INT AUTO_INCREMENT PRIMARY KEY,
      loan_id INT NOT NULL,
      complaint_date DATE NOT NULL,
      complaint_text VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'Open',
      FOREIGN KEY (loan_id) REFERENCES loan(loan_id)
    )
  `);
  console.log('complaints table created successfully');
}

createComplaintsTable().catch(e=>{
  console.log('Error creating complaints table', e);
});
