

import db from '../../config/db.js'

async function addStaff(){

    await db.query(`INSERT INTO staff (branch_id, role_id, f_name, l_name, email, phone_no, address) VALUES
               (1, 11, 'James', 'Chirwa', 'james.chirwa@finca.mw', '+265 991 111 111', 'Area 23, Lilongwe'),  -- Loan Officer
               (1, 12, 'Mercy', 'Phiri', 'mercy.phiri@finca.mw', '+265 991 222 222', 'Area 10, Lilongwe'),   -- Branch Manager
               (1, 13, 'Peter', 'Mbewe', 'peter.mbewe@finca.mw', '+265 991 333 333', 'Area 18, Lilongwe'),   -- Teller
               (1, 14, 'Patricia', 'Mwale', 'patricia.mwale@finca.mw', '+265 991 444 444', 'Area 12, Lilongwe'), -- Agent
               (1, 15, 'Bright', 'Kumwenda', 'bright.kumwenda@finca.mw', '+265 991 555 555', 'Area 5, Lilongwe'), -- ICT Officer
               (1, 16, 'Lillian', 'Zuze', 'lillian.zuze@finca.mw', '+265 991 666 666', 'Area 8, Lilongwe'),   -- Financial Officer
               (1, 17, 'Victor', 'Nyirenda', 'victor.nyirenda@finca.mw', '+265 991 777 777', 'Area 20, Lilongwe'), -- Risk Assessment Officer
               (1, 18, 'Edna', 'Mkandawire', 'edna.mkandawire@finca.mw', '+265 991 888 888', 'Area 2, Lilongwe'), -- Customer Service Officer
               (1, 19, 'Charles', 'Chimango', 'charles.chimango@finca.mw', '+265 991 999 999', 'Area 6, Lilongwe'), -- Marketing Officer
               (1, 20, 'Grace', 'Mbewe', 'grace.mbewe@finca.mw', '+265 991 000 000', 'Area 24, Lilongwe');  -- Compliance Officer
`)

     console.log('staff records added successfully')


}


addStaff().catch(e=>{
    console.log('some error occured while attempting to add staff')
})


