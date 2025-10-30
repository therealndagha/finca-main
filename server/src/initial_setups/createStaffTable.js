
import db from '../config/db.js';

async function createStaffTable(){
   await db.query(`CREATE TABLE staff(
        staff_id INT AUTO_INCREMENT PRIMARY KEY,
        branch_id INT NOT NULL,
        role_id INT NOT NULL,
        f_name VARCHAR(50),
        l_name VARCHAR(50),
        email VARCHAR(100),
        phone_no VARCHAR(100),
        address VARCHAR(100),
        FOREIGN KEY(role_id) REFERENCES role(role_id) ON DELETE CASCADE,
        FOREIGN KEY(branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
    )`)

    console.log('staff table created successfully.')

}

createStaffTable().catch(e=>{
    console.log('some error occurred while attempting to create staff table', e)
})