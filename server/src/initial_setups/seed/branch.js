

import db from '../../config/db.js';

async function addBranches(){
     const result = await db.query(`
          INSERT INTO branch (branch_name, location, phone_no) VALUES
         ('Lilongwe Central', 'Lilongwe', '+265 1 234 567'),
         ('Blantyre Main', 'Blantyre', '+265 1 345 678'),
         ('Mzuzu North', 'Mzuzu', '+265 1 456 789'),
         ('Zomba East', 'Zomba', '+265 1 567 890'),
         ('Mangochi Lakeside', 'Mangochi', '+265 1 678 901'),
         ('Kasungu Market', 'Kasungu', '+265 1 789 012'),
         ('Nkhotakota Bay', 'Nkhotakota', '+265 1 890 123'),
         ('Mchinji Crossroads', 'Mchinji', '+265 1 901 234'),
         ('Karonga Hill', 'Karonga', '+265 1 012 345'),
         ('Salima Central', 'Salima', '+265 1 123 456')

        `)

        console.log('branches added successfully to database.')
}

addBranches().catch(e=>{
    console.log('some error occured while attempting to add the branches', e);
})