import db from "../config/db.js";

// ✅ Get all payment methods
export async function getPaymentMethods(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM payment_method ORDER BY method_id");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching payment methods" });
  }
}

// ✅ Get one payment method
export async function getPaymentMethodById(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM payment_method WHERE method_id=?", [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Payment method not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching payment method" });
  }
}

// ✅ Create new payment method
export async function createPaymentMethod(req, res) {
  try {
    const { method_name, description } = req.body;

    const [result] = await db.query(
      "INSERT INTO payment_method (method_name, description) VALUES (?,?)",
      [method_name, description]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    // handle duplicate method_name gracefully
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "Method name already exists" });
    }
    res.status(500).json({ success: false, message: "Error creating payment method" });
  }
}

// ✅ Update payment method
export async function updatePaymentMethod(req, res) {
  try {
    const { method_name, description } = req.body;

    await db.query(
      "UPDATE payment_method SET method_name=?, description=? WHERE method_id=?",
      [method_name, description, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "Method name already exists" });
    }
    res.status(500).json({ success: false, message: "Error updating payment method" });
  }
}

// ✅ Delete payment method
export async function deletePaymentMethod(req, res) {
  try {
    await db.query("DELETE FROM payment_method WHERE method_id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting payment method" });
  }
}
