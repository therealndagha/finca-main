import db from "../config/db.js";

export async function getCollateral(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM collateral");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching collateral" });
  }
}

export async function getCollateralById(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM collateral WHERE collateral_id=?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Collateral not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching collateral" });
  }
}

export async function createCollateral(req, res) {
  try {
    const { loan_id, collateral_type, collateral_status, description, estimated_value } = req.body;
    const [result] = await db.query(
      "INSERT INTO collateral (loan_id, collateral_type, collateral_status, description, estimated_value) VALUES (?,?,?,?,?)",
      [loan_id, collateral_type, collateral_status, description, estimated_value]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating collateral" });
  }
}

export async function updateCollateral(req, res) {
  try {
    const { loan_id, collateral_type, collateral_status, description, estimated_value } = req.body;
    await db.query(
      "UPDATE collateral SET loan_id=?, collateral_type=?, collateral_status=?, description=?, estimated_value=? WHERE collateral_id=?",
      [loan_id, collateral_type, collateral_status, description, estimated_value, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating collateral" });
  }
}

export async function deleteCollateral(req, res) {
  try {
    await db.query("DELETE FROM collateral WHERE collateral_id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting collateral" });
  }
}
