



import db from '../config/db.js';

async function createGuarantorTable(){
  await db.query(`
  CREATE TABLE guarantor (
  guarantor_id INT AUTO_INCREMENT PRIMARY KEY,
  f_name VARCHAR(50) NOT NULL,
  l_name VARCHAR(50) NOT NULL,
  national_id_no VARCHAR(50) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  phone_no VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  email VARCHAR(100)
);

  `);
  console.log('guarantor table created successfully');
}


createGuarantorTable().catch(e=>{
    console.log('some error occured while trying to create guarantor table', e);
})