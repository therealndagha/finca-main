// controllers/customer-controllers.js
import db from '../config/db.js';

/**
 * GET /api/customers
 */
export async function getAllCustomers(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM customers ORDER BY customer_id DESC');
    return res.status(200).json({
      success: true,
      message: 'Here is the list of all customers',
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Some error occurred while trying to get customer list',
    });
  }
}

/**
 * GET /api/customers/:id
 */
export async function getCustomerById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'customer id is required' });
    }
    const [rows] = await db.query('SELECT * FROM customers WHERE customer_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'customer not found' });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Some error occurred while fetching customer' });
  }
}

/**
 * POST /api/customers
 */
export async function addCustomers(req, res) {
  try {
    const { f_name, l_name, national_id_no, customer_type, phone_no, address, email, branch_id } = req.body;
    // required fields - email can be optional based on your schema; you had it nullable
    if (!f_name || !l_name || !national_id_no || !customer_type || !phone_no || !address || !branch_id) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    // check duplicate national id
    const [existing] = await db.query('SELECT customer_id FROM customers WHERE national_id_no = ?', [national_id_no]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a customer — national_id_no already in use.',
      });
    }

    const [result] = await db.query(
      `INSERT INTO customers (f_name, l_name, national_id_no, customer_type, phone_no, address, email, branch_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [f_name, l_name, national_id_no, customer_type, phone_no, address, email || null, branch_id]
    );

    // return created resource id
    return res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      data: { customer_id: result.insertId },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Some error occurred while trying to add customer',
    });
  }
}

/**
 * PUT /api/customers/:id
 */
export async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'customer id is required' });
    }

    const [found] = await db.query('SELECT customer_id FROM customers WHERE customer_id = ?', [id]);
    if (found.length === 0) {
      return res.status(404).json({ success: false, message: 'customer not found' });
    }

    const { f_name, l_name, national_id_no, customer_type, phone_no, address, email, branch_id } = req.body;
    if (!f_name || !l_name || !national_id_no || !customer_type || !phone_no || !address || !branch_id) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    // ensure national_id_no is unique for other customers
    const [dup] = await db.query(
      'SELECT customer_id FROM customers WHERE national_id_no = ? AND customer_id <> ?',
      [national_id_no, id]
    );
    if (dup.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'national_id_no is already used by another customer',
      });
    }

    await db.query(
      `UPDATE customers SET f_name = ?, l_name = ?, national_id_no = ?, customer_type = ?, phone_no = ?, address = ?, email = ?, branch_id = ?
       WHERE customer_id = ?`,
      [f_name, l_name, national_id_no, customer_type, phone_no, address, email || null, branch_id, id]
    );

    return res.status(200).json({ success: true, message: 'Customer updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Some error occurred while trying to update customer' });
  }
}

/**
 * DELETE /api/customers/:id
 */
export async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'customer id is required' });
    }

    const [rows] = await db.query('SELECT customer_id FROM customers WHERE customer_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'customer not found' });
    }

    await db.query('DELETE FROM customers WHERE customer_id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Some error occurred while trying to delete customer' });
  }
}
