


import db from '../config/db.js'

async function createCustomerTable(){

         await db.query(`
         CREATE TABLE IF NOT EXISTS CUSTOMERS(
           customer_id INT AUTO_INCREMENT PRIMARY KEY,
           f_name VARCHAR(255)  NOT NULL,
           l_name VARCHAR(255) NOT NULL,
           national_id_no VARCHAR(50) NOT NULL,
           customer_type VARCHAR(10) NOT NULL,
           phone_no VARCHAR(50),
           address VARCHAR(255) NOT NULL,
           email VARCHAR(255),
           branch_id INT NOT NULL,
           createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           FOREIGN KEY(branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
         )
        `);

        console.log('customer table created successfully');

}

createCustomerTable().catch(e=>{
    console.log('some error occured while trying to create customer table', e);
});

