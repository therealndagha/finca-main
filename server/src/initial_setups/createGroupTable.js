



import db from '../config/db.js';

async function createGroupTable(){
  await db.query(`
    CREATE TABLE IF NOT EXISTS \`group\` (
      group_id INT AUTO_INCREMENT PRIMARY KEY,
      group_name VARCHAR(50) NOT NULL,
      group_type VARCHAR(50) NOT NULL,
      phone_no VARCHAR(50) NOT NULL,
      address VARCHAR(100) NOT NULL,
      branch_id INT NOT NULL,
      FOREIGN KEY(branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
    )
  `);
  console.log('group table created successfully');
}


createGroupTable().catch(e=>{
    console.log('some error occured while trying to create group table', e);
})