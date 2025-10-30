
import db from '../config/db.js';


async function createLoanProductTable(){
    await db.query(`
            CREATE TABLE IF NOT EXISTS loan_product (
            product_id INT AUTO_INCREMENT PRIMARY KEY,
            product_name VARCHAR(150) NOT NULL,
            interest_rate DECIMAL(5,2) NOT NULL,
            max_amount DECIMAL(15,2) NOT NULL,
            min_amount DECIMAL(15,2) NOT NULL,
            tenure_months INT NOT NULL,
            description VARCHAR(200)
)`);

console.log('loan_product table added successfully.');

}


createLoanProductTable().catch(e=>{
    console.log('some error occured while attempting to create loan_product table.');
})