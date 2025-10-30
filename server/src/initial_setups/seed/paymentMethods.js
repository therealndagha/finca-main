import db from '../../config/db.js';

async function addPaymentMethods(){
    await db.query(`
        INSERT INTO payment_method (method_name, description) VALUES
        ('Cash', 'Payment or disbursement made in cash at the branch'),
        ('Mobile Money', 'Payment or disbursement via Airtel Money or TNM Mpamba'),
        ('Bank Transfer', 'Payment or disbursement via electronic bank transfer'),
        ('Payroll Deduction', 'Repayment deducted directly from borrower’s salary'),
        ('Agent Collection', 'Payment collected in the field by an authorized agent'),
        ('Direct Debit', 'Automatic deduction from borrower’s bank account'),
        ('Cheque', 'Payment or disbursement made via cheque'),
        ('POS / Card Payment', 'Payment made at a point-of-sale terminal using a debit/credit card'),
        ('Voucher', 'Loan disbursed as a voucher for goods or services'),
        ('Cashless Group Disbursement', 'Funds disbursed collectively to a group account or wallet');
    `);
    console.log('payment_method table seeded successfully');
}

addPaymentMethods().catch(e=>{
    console.log('Some error occurred while attempting to seed payment_method table', e);
});
