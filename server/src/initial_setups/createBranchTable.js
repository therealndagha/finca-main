

import db from '../config/db.js';


async function createBranchTable(){
        await db.query(`
         CREATE TABLE IF NOT EXISTS branch(
          branch_id INT AUTO_INCREMENT PRIMARY KEY,
          branch_name VARCHAR(50),
          location VARCHAR(50),
          phone_no VARCHAR(50)
         )
        `)
        console.log('branch table created successfully');
};


createBranchTable().catch(e=>{
    console.log('some error occured while trying to create branch table', e);
});