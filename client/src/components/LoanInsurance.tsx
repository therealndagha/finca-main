import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type LoanInsurance = {
  insurance_id: number;
  loan_id: number;
  insurance_provider: string;
  coverage_amount: number;
  premium: number;
};

export default function LoanInsurance() {
  const emptyForm: Omit<LoanInsurance, "insurance_id"> = {
    loan_id: 0,
    insurance_provider: "",
    coverage_amount: 0,
    premium: 0,
  };

  const [records, setRecords] = useState<LoanInsurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/loan_insurance");
      const data = await res.json();
      if (data.success) setRecords(data.data);
      else setError("Failed to fetch loan insurance records");
    } catch (err) {
      console.error(err);
      setError("Error fetching loan insurance records");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "loan_id" || name === "coverage_amount" || name === "premium"
          ? parseFloat(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `http://localhost:3000/api/loan_insurance/${editingId}`
        : "http://localhost:3000/api/loan_insurance";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchRecords();
        setForm(emptyForm);
        setEditingId(null);
      } else setError("Failed to save record");
    } catch (err) {
      console.error(err);
      setError("Network error while saving record");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(record: LoanInsurance) {
    setForm({
      loan_id: record.loan_id,
      insurance_provider: record.insurance_provider,
      coverage_amount: record.coverage_amount,
      premium: record.premium,
    });
    setEditingId(record.insurance_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this record?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/loan_insurance/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success)
        setRecords((prev) => prev.filter((r) => r.insurance_id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete record");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
  }

  // Statistics
  const totalCoverage = records.reduce((sum, r) => sum + Number(r.coverage_amount || 0), 0);
  const totalPremium = records.reduce((sum, r) => sum + Number(r.premium || 0), 0);
  const totalPolicies = records.length;

  const formatCurrency = (num: number) =>
    num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      <Navbar />

      {/* Header */}
      <div className="bg-blue-950 text-white py-6 px-6 space-y-2">
        <h1 className="text-5xl font-roboto">Loan Insurance</h1>
        <p className="font-inter text-lg opacity-90">
          Manage loan insurance policies efficiently
        </p>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 mt-6">
        <div className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-blue-700">Total Policies</h3>
          <p className="text-3xl font-bold">{totalPolicies}</p>
        </div>
        <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-700">Total Coverage</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalCoverage)}</p>
        </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-yellow-700">Total Premium</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalPremium)}</p>
        </div>
      </div>

      {/* Form */}
      <div className="my-6 px-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-4 rounded shadow-md max-w-3xl"
        >
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Record" : "Add Insurance"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Loan ID</label>
              <input
                type="number"
                name="loan_id"
                value={form.loan_id || ""}
                onChange={handleChange}
                placeholder="Loan ID"
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Insurance Provider</label>
              <input
                name="insurance_provider"
                value={form.insurance_provider}
                onChange={handleChange}
                placeholder="Insurance Provider"
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Coverage Amount</label>
              <input
                type="number"
                name="coverage_amount"
                value={form.coverage_amount || ""}
                onChange={handleChange}
                placeholder="Coverage Amount"
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Premium</label>
              <input
                type="number"
                name="premium"
                value={form.premium || ""}
                onChange={handleChange}
                placeholder="Premium"
                className="border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="ml-3 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Collapse / Expand Table */}
      <div className="px-6">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="mb-4 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          {collapsed ? "Expand Insurance Table" : "Collapse Insurance Table"}
        </button>
      </div>

      {/* Table */}
      {!collapsed && (
        <div className="overflow-x-auto mx-6 my-6 bg-white rounded-lg shadow-md">
          {loading ? (
            <Spinner />
          ) : (
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Loan ID</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Coverage</th>
                  <th className="px-4 py-3">Premium</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6">
                      No insurance records
                    </td>
                  </tr>
                ) : (
                  records.map((r, idx) => (
                    <tr
                      key={r.insurance_id}
                      className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">{r.insurance_id}</td>
                      <td className="px-4 py-3 text-gray-700">{r.loan_id}</td>
                      <td className="px-4 py-3 text-gray-700">{r.insurance_provider}</td>
                      <td className="px-4 py-3 text-gray-700">{formatCurrency(r.coverage_amount)}</td>
                      <td className="px-4 py-3 text-gray-700">{formatCurrency(r.premium)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(r)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r.insurance_id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
