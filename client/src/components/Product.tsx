import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type LoanProduct = {
  product_id: number;
  product_name: string;
  interest_rate: number;
  max_amount: number;
  min_amount: number;
  tenure_months: number;
  description?: string;
};

export default function Products() {
  const emptyForm: Omit<LoanProduct, "product_id"> = {
    product_name: "",
    interest_rate: 0,
    max_amount: 0,
    min_amount: 0,
    tenure_months: 0,
    description: "",
  };

  const [loanList, setLoanList] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/loanproducts");
      const data = await res.json();
      if (data.success) setLoanList(data.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching loans");
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
        name.includes("amount") ||
        name === "interest_rate" ||
        name === "tenure_months"
          ? parseFloat(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `http://localhost:3000/api/loanproducts/${editingId}`
        : "http://localhost:3000/api/loanproducts";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchLoans();
        setForm(emptyForm);
        setEditingId(null);
      } else setError("Failed to save loan product");
    } catch {
      setError("Network error while saving loan product");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(loan: LoanProduct) {
    setForm({ ...loan });
    setEditingId(loan.product_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this loan product?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/loanproducts/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success)
        setLoanList((prev) => prev.filter((l) => l.product_id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete loan product");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col">
        <div className="bg-blue-950 text-white py-5 px-5 space-y-2">
          <h1 className="text-5xl font-roboto">Loan Products</h1>
          <p className="font-inter">Manage FINCA Malawi loan products</p>
        </div>

        {/* Form */}
        <div className="my-6 px-5">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-4 rounded shadow-md max-w-3xl"
          >
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Loan" : "Add Loan"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Product Name
                </label>
                <input
                  name="product_name"
                  value={form.product_name}
                  onChange={handleChange}
                  placeholder="Enter loan product name"
                  className="border rounded px-3 py-2"
                />
              </div>

              {/* Interest Rate */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Interest Rate (%)
                </label>
                <input
                  name="interest_rate"
                  value={form.interest_rate || ""}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  placeholder="e.g. 12.5"
                  className="border rounded px-3 py-2"
                />
              </div>

              {/* Max Amount */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Maximum Amount
                </label>
                <input
                  name="max_amount"
                  value={form.max_amount || ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter maximum amount"
                  className="border rounded px-3 py-2"
                />
              </div>

              {/* Min Amount */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Minimum Amount
                </label>
                <input
                  name="min_amount"
                  value={form.min_amount || ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter minimum amount"
                  className="border rounded px-3 py-2"
                />
              </div>

              {/* Tenure */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Tenure (Months)
                </label>
                <input
                  name="tenure_months"
                  value={form.tenure_months || ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter number of months"
                  className="border rounded px-3 py-2"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this loan product"
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
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Loan"
                  : "Add Loan"}
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

        {/* Table */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto mx-5">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Interest %</th>
                  <th className="px-4 py-3">Max Amount</th>
                  <th className="px-4 py-3">Min Amount</th>
                  <th className="px-4 py-3">Tenure</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loanList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      No loan products yet
                    </td>
                  </tr>
                ) : (
                  loanList.map((l, idx) => (
                    <tr
                      key={l.product_id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3">{l.product_id}</td>
                      <td className="px-4 py-3">{l.product_name}</td>
                      <td className="px-4 py-3">{l.interest_rate}%</td>
                      <td className="px-4 py-3">
                        {l.max_amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {l.min_amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {l.tenure_months} months
                      </td>
                      <td className="px-4 py-3">
                        {l.description || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(l)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(l.product_id)}
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
          </div>
        )}
      </div>
    </div>
  );
}
