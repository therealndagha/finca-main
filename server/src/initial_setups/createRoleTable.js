

import db from '../config/db.js';

async function createRoleTable(){
  await db.query(`CREATE TABLE role(
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    role_description VARCHAR(100) NOT NULL
    )`);

    console.log('role table created successfully');
}

createRoleTable().catch(e=>{
    console.log('some error occured while trying to create role table');
})
