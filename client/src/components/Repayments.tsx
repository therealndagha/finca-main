import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type Repayment = {
  repayment_id: number;
  loan_id: number;
  amount_paid: number;
  payment_date: string; // 'YYYY-MM-DD'
  payment_method: string;
  balance?: number;
  staff_id?: number;
  notes?: string;
};

type RepaymentForm = Omit<Repayment, "repayment_id">;

export default function Repayments() {
  const emptyForm: RepaymentForm = {
    loan_id: 0,
    amount_paid: 0,
    payment_date: "",
    payment_method: "",
    balance: 0,
    staff_id: undefined,
    notes: "",
  };

  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [form, setForm] = useState<RepaymentForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Helper to format dates as YYYY-MM-DD ---
  function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset);
    return d.toISOString().split("T")[0];
  }

  useEffect(() => {
    fetchRepayments();
  }, []);

  async function fetchRepayments() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/repayments");
      const data = await res.json();
      if (data.success) setRepayments(data.data);
      else setError("Failed to fetch repayments");
    } catch {
      setError("Network error while fetching repayments");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "loan_id" || name === "amount_paid" || name === "staff_id" || name === "balance"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };

      const url = editingId
        ? `http://localhost:3000/api/repayments/${editingId}`
        : "http://localhost:3000/api/repayments";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        await fetchRepayments();
        setForm(emptyForm);
        setEditingId(null);
        setError(null);
      } else setError(data.message || "Failed to save repayment");
    } catch {
      setError("Network error while saving repayment");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(rep: Repayment) {
    setForm({
      ...rep,
      payment_date: formatDate(rep.payment_date),
    });
    setEditingId(rep.repayment_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this repayment?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/repayments/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setRepayments((prev) => prev.filter((r) => r.repayment_id !== id));
    } catch {
      setError("Failed to delete repayment");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
  }

  // --- Statistics ---
  const totalRepayments = repayments.length;
  const totalAmountPaid = repayments.reduce((sum, r) => sum + Number(r.amount_paid), 0);
  const avgRepayment = totalRepayments > 0 ? totalAmountPaid / totalRepayments : 0;

  return (
    <div>
      <Navbar />
      <div className="flex flex-col">
        <div className="bg-blue-950 text-white py-5 px-5 space-y-2">
          <h1 className="text-5xl font-roboto">Repayments</h1>
          <p className="font-inter">Manage loan repayments</p>
        </div>

        {/* --- Statistics --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 mt-4">
          <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-purple-700">Total Repayments</h3>
            <p className="text-3xl font-bold">{totalRepayments}</p>
          </div>
          <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-green-700">Total Amount Paid</h3>
            <p className="text-3xl font-bold">{totalAmountPaid.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-yellow-700">Average Repayment</h3>
            <p className="text-3xl font-bold">{avgRepayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* --- Form --- */}
        <div className="my-6 px-5">
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-md max-w-3xl">
            <h2 className="text-xl font-semibold">{editingId ? "Edit Repayment" : "Add Repayment"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Loan ID</label>
                <input
                  name="loan_id"
                  value={form.loan_id || ""}
                  onChange={handleChange}
                  type="number"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Amount Paid</label>
                <input
                  name="amount_paid"
                  value={form.amount_paid || ""}
                  onChange={handleChange}
                  type="number"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Payment Date</label>
                <input
                  name="payment_date"
                  value={form.payment_date}
                  onChange={handleChange}
                  type="date"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Payment Method</label>
                <input
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleChange}
                  type="text"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Balance</label>
                <input
                  name="balance"
                  value={form.balance || ""}
                  onChange={handleChange}
                  type="number"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Staff ID</label>
                <input
                  name="staff_id"
                  value={form.staff_id || ""}
                  onChange={handleChange}
                  type="number"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes || ""}
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
                {saving ? "Saving..." : editingId ? "Update Repayment" : "Add Repayment"}
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
                  <th className="px-4 py-3">Amount Paid</th>
                  <th className="px-4 py-3">Payment Date</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3">Staff ID</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {repayments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      No repayments yet
                    </td>
                  </tr>
                ) : (
                  repayments.map((r, idx) => (
                    <tr key={r.repayment_id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}>
                      <td className="px-4 py-3">{r.repayment_id}</td>
                      <td className="px-4 py-3">{r.loan_id}</td>
                      <td className="px-4 py-3">{r.amount_paid.toLocaleString()}</td>
                      <td className="px-4 py-3">{formatDate(r.payment_date)}</td>
                      <td className="px-4 py-3">{r.payment_method}</td>
                      <td className="px-4 py-3">{r.balance?.toLocaleString()}</td>
                      <td className="px-4 py-3">{r.staff_id}</td>
                      <td className="px-4 py-3">{r.notes}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline mr-2">Edit</button>
                        <button onClick={() => handleDelete(r.repayment_id)} className="text-red-600 hover:underline">Delete</button>
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
