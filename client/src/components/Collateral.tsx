// src/components/Collateral.tsx
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type Collateral = {
  collateral_id: number;
  loan_id?: number;
  collateral_type: string;
  estimated_value?: number;
  description?: string;
};

type CollateralForm = Omit<Collateral, "collateral_id">;

export default function Collateral() {
  const emptyForm: CollateralForm = {
    loan_id: undefined,
    collateral_type: "",
    estimated_value: undefined,
    description: "",
  };

  const [collaterals, setCollaterals] = useState<Collateral[]>([]);
  const [form, setForm] = useState<CollateralForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch data ---
  useEffect(() => {
    fetchCollaterals();
  }, []);

  async function fetchCollaterals() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/collateral");
      const data = await res.json();
      if (data.success) {
        // Ensure estimated_value is numeric
        const normalized = data.data.map((c: Collateral) => ({
          ...c,
          estimated_value: c.estimated_value ? Number(c.estimated_value) : 0,
        }));
        setCollaterals(normalized);
      } else setError("Failed to fetch collaterals");
    } catch {
      setError("Network error while fetching collaterals");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "loan_id" || name === "estimated_value" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `http://localhost:3000/api/collateral/${editingId}`
        : "http://localhost:3000/api/collateral";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCollaterals();
        setForm(emptyForm);
        setEditingId(null);
        setError(null);
      } else setError(data.message || "Failed to save collateral");
    } catch {
      setError("Network error while saving collateral");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(c: Collateral) {
    setForm({ ...c });
    setEditingId(c.collateral_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this collateral?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/collateral/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setCollaterals((prev) => prev.filter((c) => c.collateral_id !== id));
    } catch {
      setError("Failed to delete collateral");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
  }

  // --- Statistics ---
  const totalCollateral = collaterals.length;
  const totalEstimatedValue = collaterals.reduce(
    (sum, c) => sum + (c.estimated_value || 0),
    0
  );

  return (
    <div>
      <Navbar />
      <div className="flex flex-col">
        <div className="bg-blue-950 text-white py-5 px-5 space-y-2">
          <h1 className="text-5xl font-roboto">Collateral</h1>
          <p className="font-inter">Manage loan collaterals</p>
        </div>

        {/* --- Statistics --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 mt-4">
          <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-purple-700">Total Collaterals</h3>
            <p className="text-3xl font-bold">{totalCollateral}</p>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-yellow-700">Total Estimated Value</h3>
            <p className="text-3xl font-bold">
              {totalEstimatedValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* --- Form --- */}
        <div className="my-6 px-5">
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-md max-w-3xl">
            <h2 className="text-xl font-semibold">{editingId ? "Edit Collateral" : "Add Collateral"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Loan ID</label>
                <input
                  name="loan_id"
                  type="number"
                  value={form.loan_id || ""}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Collateral Type</label>
                <input
                  name="collateral_type"
                  type="text"
                  value={form.collateral_type}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Estimated Value</label>
                <input
                  name="estimated_value"
                  type="number"
                  value={form.estimated_value || ""}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
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
                {saving ? "Saving..." : editingId ? "Update Collateral" : "Add Collateral"}
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

        {/* --- Table --- */}
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-red-600 px-6">{error}</div>
        ) : (
          <div className="overflow-x-auto mx-5">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Loan ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Estimated Value</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collaterals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No collaterals yet
                    </td>
                  </tr>
                ) : (
                  collaterals.map((c, idx) => (
                    <tr
                      key={c.collateral_id}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3">{c.collateral_id}</td>
                      <td className="px-4 py-3">{c.loan_id}</td>
                      <td className="px-4 py-3">{c.collateral_type}</td>
                      <td className="px-4 py-3">
                        {c.estimated_value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3">{c.description}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline mr-2">Edit</button>
                        <button onClick={() => handleDelete(c.collateral_id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
