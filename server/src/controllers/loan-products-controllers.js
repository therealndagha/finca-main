import db from "../config/db.js";

// GET all loan products
export async function getAllLoans(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM loan_products ORDER BY product_id ASC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching loan products" });
  }
}

// GET single loan by ID
export async function getLoanById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM loan_products WHERE product_id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Loan product not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching loan product" });
  }
}

// CREATE loan product
export async function createLoan(req, res) {
  const { product_name, interest_rate, max_amount, min_amount, tenure_months, description } = req.body;
  if (!product_name || !interest_rate || !max_amount || !min_amount || !tenure_months) {
    return res.status(400).json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO loan_products (product_name, interest_rate, max_amount, min_amount, tenure_months, description) VALUES (?, ?, ?, ?, ?, ?)",
      [product_name, interest_rate, max_amount, min_amount, tenure_months, description]
    );
    const [rows] = await db.query("SELECT * FROM loan_products WHERE product_id = ?", [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating loan product" });
  }
}

// UPDATE loan product
export async function updateLoan(req, res) {
  const { id } = req.params;
  const { product_name, interest_rate, max_amount, min_amount, tenure_months, description } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM loan_products WHERE product_id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: "Loan product not found" });

    await db.query(
      "UPDATE loan_products SET product_name=?, interest_rate=?, max_amount=?, min_amount=?, tenure_months=?, description=? WHERE product_id=?",
      [product_name, interest_rate, max_amount, min_amount, tenure_months, description, id]
    );

    const [rows] = await db.query("SELECT * FROM loan_products WHERE product_id = ?", [id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating loan product" });
  }
}

// DELETE loan product
export async function deleteLoan(req, res) {
  const { id } = req.params;
  try {
    const [existing] = await db.query("SELECT * FROM loan_products WHERE product_id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: "Loan product not found" });

    await db.query("DELETE FROM loan_products WHERE product_id = ?", [id]);
    res.json({ success: true, message: "Loan product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting loan product" });
  }
}
