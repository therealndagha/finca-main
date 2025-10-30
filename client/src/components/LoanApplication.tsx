import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type LoanApplication = {
  loan_application_id: number;
  customer_id: number | null;
  group_id: number | null;
  product_id: number;
  branch_id: number;
  amount_applied: number;
  tenure_months: number;
  application_date?: string;
  status?: string;
  guarantor_id: number | null;
};

export default function LoanApplications() {
  const emptyForm: Omit<LoanApplication, "loan_application_id"> = {
    customer_id: null,
    group_id: null,
    product_id: 0,
    branch_id: 0,
    amount_applied: 0,
    tenure_months: 0,
    application_date: "",
    status: "Pending",
    guarantor_id: null,
  };

  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/loanapplications");
      const data = await res.json();
      if (data.success) setApplications(data.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching loan applications");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "amount_applied" || name === "tenure_months"
          ? parseFloat(value)
          : value === "" ? null : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `http://localhost:3000/api/loanapplications/${editingId}`
        : "http://localhost:3000/api/loanapplications";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchApplications();
        setForm(emptyForm);
        setEditingId(null);
      } else setError("Failed to save loan application");
    } catch {
      setError("Network error while saving loan application");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(app: LoanApplication) {
    setForm({ ...app });
    setEditingId(app.loan_application_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this loan application?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/loanapplications/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success)
        setApplications((prev) =>
          prev.filter((a) => a.loan_application_id !== id)
        );
    } catch (err) {
      console.error(err);
      setError("Failed to delete loan application");
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
          <h1 className="text-5xl font-roboto">Loan Applications</h1>
          <p className="font-inter">Manage loan applications</p>
        </div>

        {/* Form */}
        <div className="my-6 px-5">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-4 rounded shadow-md max-w-3xl"
          >
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Application" : "Add Application"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Customer ID</label>
                <input
                  name="customer_id"
                  value={form.customer_id || ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="Customer ID"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Group ID</label>
                <input
                  name="group_id"
                  value={form.group_id || ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="Group ID"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Product ID</label>
                <input
                  name="product_id"
                  value={form.product_id || ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="Product ID"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Branch ID</label>
                <input
                  name="branch_id"
                  value={form.branch_id || ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="Branch ID"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Amount</label>
                <input
                  name="amount_applied"
                  value={form.amount_applied || ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="Amount Applied"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Tenure (Months)</label>
                <input
                  name="tenure_months"
                  value={form.tenure_months || ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="Months"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Status</label>
                <input
                  name="status"
                  value={form.status || ""}
                  onChange={handleChange}
                  placeholder="Status"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Guarantor ID</label>
                <input
                  name="guarantor_id"
                  value={form.guarantor_id || ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="Guarantor ID"
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
                  ? "Update Application"
                  : "Add Application"}
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
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Tenure</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Guarantor</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-4">
                      No loan applications yet
                    </td>
                  </tr>
                ) : (
                  applications.map((a, idx) => (
                    <tr
                      key={a.loan_application_id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3">{a.loan_application_id}</td>
                      <td className="px-4 py-3">{a.customer_id}</td>
                      <td className="px-4 py-3">{a.group_id}</td>
                      <td className="px-4 py-3">{a.product_id}</td>
                      <td className="px-4 py-3">{a.branch_id}</td>
                      <td className="px-4 py-3">
                        {a.amount_applied.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{a.tenure_months} months</td>
                      <td className="px-4 py-3">{a.status}</td>
                      <td className="px-4 py-3">{a.guarantor_id}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(a)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(a.loan_application_id)
                          }
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
