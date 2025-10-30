

import db from '../../config/db.js';

async function addCustomers(){
  
    const result = await db.query(`
         INSERT INTO customers (f_name, l_name, national_id_no, customer_type, phone_no, address, email, branch_id) VALUES
        ('James', 'Chirwa', 'MA1234567', 'Individual', '+265 999 111 222', 'Area 23, Lilongwe', 'james.chirwa@example.com', 1),
        ('Mercy', 'Phiri', 'MA2345678', 'Individual', '+265 999 222 333', 'Area 25, Lilongwe', 'mercy.phiri@example.com', 1),
        ('Peter', 'Mbewe', 'MA3456789', 'Individual', '+265 999 333 444', 'Area 10, Lilongwe', 'peter.mbewe@example.com', 1),
        ('Patricia', 'Mwale', 'MA4567890', 'Individual', '+265 999 444 555', 'Area 12, Lilongwe', 'patricia.mwale@example.com', 1),
        ('Bright', 'Kumwenda', 'MA5678901', 'Individual', '+265 999 555 666', 'Area 18, Lilongwe', 'bright.kumwenda@example.com', 1),
        ('Lillian', 'Zuze', 'MA6789012', 'Individual', '+265 999 666 777', 'Area 20, Lilongwe', 'lillian.zuze@example.com', 1),
        ('Victor', 'Nyirenda', 'MA7890123', 'Individual', '+265 999 777 888', 'Area 5, Lilongwe', 'victor.nyirenda@example.com', 1),
        ('Edna', 'Mkandawire', 'MA8901234', 'Individual', '+265 999 888 999', 'Area 2, Lilongwe', 'edna.mkandawire@example.com', 1),
        ('Charles', 'Chimango', 'MA9012345', 'Individual', '+265 999 000 111', 'Area 8, Lilongwe', 'charles.chimango@example.com', 1),
        ('Grace', 'Mbewe', 'MA0123456', 'Individual', '+265 999 111 222', 'Area 6, Lilongwe', 'grace.mbewe@example.com', 1);

        `);

    console.log('customers added successfully to database');

}

addCustomers().catch(e=>{
    console.log('customers added successfully', e);
})