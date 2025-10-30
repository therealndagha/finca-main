import db from "../config/db.js";

// ✅ Get all guarantors
export async function getGuarantors(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM guarantor");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching guarantors" });
  }
}

// ✅ Get a single guarantor by ID
export async function getGuarantorById(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM guarantor WHERE guarantor_id=?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Guarantor not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching guarantor" });
  }
}

// ✅ Create a new guarantor
export async function createGuarantor(req, res) {
  try {
    const {
      f_name,
      l_name,
      national_id_no,
      relationship,
      phone_no,
      address,
      email,
    } = req.body;

    const [result] = await db.query(
      "INSERT INTO guarantor (f_name, l_name, national_id_no, relationship, phone_no, address, email) VALUES (?,?,?,?,?,?,?)",
      [f_name, l_name, national_id_no, relationship, phone_no, address, email]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating guarantor" });
  }
}

// ✅ Update a guarantor
export async function updateGuarantor(req, res) {
  try {
    const {
      f_name,
      l_name,
      national_id_no,
      relationship,
      phone_no,
      address,
      email,
    } = req.body;

    await db.query(
      "UPDATE guarantor SET f_name=?, l_name=?, national_id_no=?, relationship=?, phone_no=?, address=?, email=? WHERE guarantor_id=?",
      [f_name, l_name, national_id_no, relationship, phone_no, address, email, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating guarantor" });
  }
}

// ✅ Delete a guarantor
export async function deleteGuarantor(req, res) {
  try {
    await db.query("DELETE FROM guarantor WHERE guarantor_id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting guarantor" });
  }
}
