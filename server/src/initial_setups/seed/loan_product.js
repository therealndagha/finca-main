
import db from '../../config/db.js';


async function addLoanProducts(){
    await db.query(`
          INSERT INTO loan_product (product_name, interest_rate, max_amount, min_amount, tenure_months, description) VALUES
('Small Enterprise Loan', 12.50, 500000.00, 10000.00, 12, 'Loan to support small businesses and entrepreneurs'),
('Payroll Loan', 10.00, 400000.00, 5000.00, 6, 'Loan for employees to cover salary advances or payroll needs'),
('Village Bank Loan (Group Loan)', 11.00, 300000.00, 5000.00, 12, 'Group-based loan for Village Bank members'),
('Business Loan', 13.00, 450000.00, 10000.00, 12, 'Loan to expand or start a small to medium business'),
('Education Loan', 9.50, 150000.00, 1000.00, 12, 'Loan to cover school fees and educational expenses'),
('Clean Energy Loan', 10.50, 250000.00, 5000.00, 12, 'Loan to purchase solar systems, clean cookstoves, or other energy solutions');

        `);
    console.log('loan products have been added successfully.');
}

addLoanProducts().catch(e=>{
    console.log('some error occured while attempting to add loan products.');
})