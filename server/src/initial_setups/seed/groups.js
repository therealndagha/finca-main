
import db from '../../config/db.js';


async function addGroups(){
    await db.query(`
           INSERT INTO \`group\` (group_name, group_type, phone_no, address, branch_id) VALUES
           ('Lilongwe Savings Club', 'Savings', '+265 991 111 111', 'Area 23, Lilongwe', 1),
           ('Area 23 Village Bank', 'Village Banking', '+265 991 222 222', 'Area 23, Lilongwe', 1),
           ('Central Loan Circle', 'Loan Circle', '+265 991 333 333', 'Area 12, Lilongwe', 1),
           ('Lilongwe Agriculture Group', 'Agriculture', '+265 991 444 444', 'Area 18, Lilongwe', 1),
           ('Women Empowerment Lilongwe', 'Women Empowerment', '+265 991 555 555', 'Area 20, Lilongwe', 1),
           ('Youth Development Hub', 'Youth Development', '+265 991 666 666', 'Area 5, Lilongwe', 1),
           ('Microenterprise Network', 'Microenterprise', '+265 991 777 777', 'Area 8, Lilongwe', 1),
           ('Community Support Circle', 'Community Support', '+265 991 888 888', 'Area 2, Lilongwe', 1),
           ('Education Advancement Group', 'Education', '+265 991 999 999', 'Area 10, Lilongwe', 1),
           ('Health Awareness Committee', 'Health Awareness', '+265 991 000 000', 'Area 6, Lilongwe', 1);

        `)

        console.log('groups added successfully.')
}

addGroups().catch(e=>{
    console.log('some error occured while trying')
})