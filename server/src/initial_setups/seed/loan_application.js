
import db from '../../config/db.js';

async function addLoanApplications() {
  const result = await db.query(`
    INSERT INTO loan_application (customer_id, product_id, branch_id, staff_id, amount_applied, tenure_months, status, guarantor_id) VALUES
    (1, 1, 1, 1, 200000.00, 12, 'Pending', 1),
    (2, 1, 1, 1, 150000.00, 10, 'Pending', 2),
    (3, 1, 1, 1, 300000.00, 24, 'Pending', 3),
    (4, 1, 1, 1, 100000.00, 8, 'Pending', 4),
    (5, 1, 1, 1, 250000.00, 18, 'Pending', 5),
    (6, 1, 1, 1, 175000.00, 12, 'Pending', 6),
    (7, 1, 1, 1, 220000.00, 15, 'Pending', 7),
    (8, 1, 1, 1, 50000.00, 6, 'Pending', 8),
    (9, 1, 1, 1, 400000.00, 30, 'Pending', 9),
    (10, 1, 1, 1, 120000.00, 9, 'Pending', 10);
  `);

  console.log('loan applications added successfully to database');
}

addLoanApplications().catch(e => {
  console.log('Error adding loan applications', e);
});
