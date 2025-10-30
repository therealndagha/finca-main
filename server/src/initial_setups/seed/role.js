

import db from '../../config/db.js';

async function addRoles(){
    await db.query(`INSERT INTO role (role_name, role_description) VALUES
                    ('Loan Officer', 'Responsible for processing and managing client loans'),
                    ('Branch Manager', 'Oversees branch operations and staff management'),
                    ('Teller', 'Handles daily cash transactions and customer payments'),
                    ('Agent', 'Provides banking services outside the branch to clients'),
                    ('ICT Officer', 'Maintains IT systems and network infrastructure'),
                    ('Financial Officer', 'Manages financial records and reporting'),
                    ('Risk Assessment Officer', 'Evaluates and mitigates financial risks'),
                    ('Customer Service Officer', 'Handles client inquiries and support'),
                    ('Marketing Officer', 'Promotes products and services to attract clients'),
                    ('Compliance Officer', 'Ensures adherence to policies and regulatory requirements');
`)
    console.log('role table created successfully');
}


addRoles().catch(e=>{
    console.log('some error occured while attempting to add roles.');
})