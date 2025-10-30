
import db from '../../config/db.js';


async function addGuarantors(){
    await db.query(`
 INSERT INTO guarantor (f_name, l_name, national_id_no, relationship, phone_no, address, email) VALUES
('John', 'Phiri', 'GN1234567', 'Brother', '+265991111111', 'Area 23, Lilongwe', 'john.phiri@example.com'),
('Mary', 'Chirwa', 'GN2345678', 'Friend', '+265991222222', 'Area 10, Lilongwe', 'mary.chirwa@example.com'),
('Patrick', 'Mbewe', 'GN3456789', 'Employer', '+265991333333', 'Area 18, Lilongwe', 'patrick.mbewe@example.com'),
('Grace', 'Mwale', 'GN4567890', 'Sister', '+265991444444', 'Area 12, Lilongwe', 'grace.mwale@example.com'),
('Steven', 'Kumwenda', 'GN5678901', 'Uncle', '+265991555555', 'Area 5, Lilongwe', 'steven.kumwenda@example.com'),
('Lucy', 'Zuze', 'GN6789012', 'Aunt', '+265991666666', 'Area 8, Lilongwe', 'lucy.zuze@example.com'),
('Victor', 'Nyirenda', 'GN7890123', 'Cousin', '+265991777777', 'Area 20, Lilongwe', 'victor.nyirenda@example.com'),
('Edna', 'Mkandawire', 'GN8901234', 'Family Friend', '+265991888888', 'Area 2, Lilongwe', 'edna.mkandawire@example.com'),
('Charles', 'Chimango', 'GN9012345', 'Colleague', '+265991999999', 'Area 6, Lilongwe', 'charles.chimango@example.com'),
('Agnes', 'Mbewe', 'GN0123456', 'Neighbour', '+265991000000', 'Area 24, Lilongwe', 'agnes.mbewe@example.com');

        `);
    console.log('guarantors have been added successfully.');
}

addGuarantors().catch(e=>{
    console.log('some error occured while attempting to add guarantors.');
})