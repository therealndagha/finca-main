import db from '../config/db.js'

export const getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM loan_application");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM loan_application WHERE loan_application_id = ?",
      [req.params.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const {
      customer_id,
      group_id,
      product_id,
      branch_id,
      amount_applied,
      tenure_months,
      status,
      guarantor_id,
    } = req.body;
    const [result] = await db.query(
      `INSERT INTO loan_application 
       (customer_id, group_id, product_id, branch_id, amount_applied, tenure_months, status, guarantor_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        group_id,
        product_id,
        branch_id,
        amount_applied,
        tenure_months,
        status || "Pending",
        guarantor_id,
      ]
    );
    res.json({ success: true, insertId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const {
      customer_id,
      group_id,
      product_id,
      branch_id,
      amount_applied,
      tenure_months,
      status,
      guarantor_id,
    } = req.body;
    await db.query(
      `UPDATE loan_application 
       SET customer_id=?, group_id=?, product_id=?, branch_id=?, amount_applied=?, tenure_months=?, status=?, guarantor_id=? 
       WHERE loan_application_id=?`,
      [
        customer_id,
        group_id,
        product_id,
        branch_id,
        amount_applied,
        tenure_months,
        status,
        guarantor_id,
        req.params.id,
      ]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await db.query("DELETE FROM loan_application WHERE loan_application_id=?", [
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
