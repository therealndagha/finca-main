import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type Loan = {
  loan_id: number;
  loan_application_id: number;
  loan_amount: number;
  staff_id: number;
  start_date: string;
  end_date: string;
  status: "Active" | "Completed" | "Defaulted" | "Suspended";
  interest_rate: number;
  created_at: string | null;
  updated_at: string | null;
};

type LoanForm = Omit<Loan, "loan_id" | "created_at" | "updated_at">;

export default function Loans() {
  const emptyForm: LoanForm = {
    loan_application_id: 0,
    loan_amount: 0,
    staff_id: 1,
    start_date: "",
    end_date: "",
    status: "Active",
    interest_rate: 0,
  };

  const [loanList, setLoanList] = useState<Loan[]>([]);
  const [form, setForm] = useState<LoanForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(true);

  // --- Helper to format dates as YYYY-MM-DD ---
  function formatDate(dateStr: string | null) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset);
    return d.toISOString().split("T")[0];
  }

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/loans");
      const data = await res.json();
      if (data.success) setLoanList(data.data);
      else setError("Failed to fetch loans");
    } catch {
      setError("Network error while fetching loans");
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
        name === "loan_amount" ||
        name === "loan_application_id" ||
        name === "staff_id" ||
        name === "interest_rate"
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
        ? `http://localhost:3000/api/loans/${editingId}`
        : "http://localhost:3000/api/loans";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        await fetchLoans();
        setForm(emptyForm);
        setEditingId(null);
        setError(null);
      } else {
        setError(data.message || "Failed to save loan");
      }
    } catch {
      setError("Network error while saving loan");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(loan: Loan) {
    setForm({
      ...loan,
      start_date: formatDate(loan.start_date),
      end_date: formatDate(loan.end_date),
    });
    setEditingId(loan.loan_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this loan?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/loans/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) setLoanList((prev) => prev.filter((l) => l.loan_id !== id));
    } catch {
      setError("Failed to delete loan");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
  }

  // --- Statistics ---
  const totalLoans = loanList.length;
  const activeLoans = loanList.filter((l) => l.status === "Active").length;
  const completedLoans = loanList.filter((l) => l.status === "Completed").length;
  const totalAmountLoaned = loanList.reduce((sum, l) => sum + Number(l.loan_amount), 0);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col">
        <div className="bg-blue-950 text-white py-5 px-5 space-y-2">
          <h1 className="text-5xl font-roboto">Loans</h1>
          <p className="font-inter">Manage customer loans</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-6 mt-4">
          <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-purple-700">Total Loans</h3>
            <p className="text-3xl font-bold">{totalLoans}</p>
          </div>
          <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-green-700">Active Loans</h3>
            <p className="text-3xl font-bold">{activeLoans}</p>
          </div>
          <div className="bg-gray-100 border-l-4 border-gray-600 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Completed Loans</h3>
            <p className="text-3xl font-bold">{completedLoans}</p>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-yellow-700">Total Amount Loaned</h3>
            <p className="text-3xl font-bold">{totalAmountLoaned.toLocaleString()}</p>
          </div>
        </div>

        {/* Form */}
        <div className="my-6 px-5">
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-md max-w-3xl">
            <h2 className="text-xl font-semibold">{editingId ? "Edit Loan" : "Add Loan"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Loan Application ID</label>
                <input
                  name="loan_application_id"
                  value={form.loan_application_id || ""}
                  onChange={handleChange}
                  type="number"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Loan Amount</label>
                <input
                  name="loan_amount"
                  value={form.loan_amount || ""}
                  onChange={handleChange}
                  type="number"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Start Date</label>
                <input
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  type="date"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">End Date</label>
                <input
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  type="date"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Interest Rate (%)</label>
                <input
                  name="interest_rate"
                  value={form.interest_rate || ""}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-medium mb-1">Status</label>
                <input
                  name="status"
                  value={form.status}
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
                {saving ? "Saving..." : editingId ? "Update Loan" : "Add Loan"}
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
        <div className="px-6 mb-2">
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            {collapsed ? "Show Loans Table" : "Hide Loans Table"}
          </button>
        </div>

        {/* Table */}
        {!collapsed && (
          <div className="overflow-x-auto mx-5">
            {loading ? (
              <Spinner />
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <table className="min-w-full border-separate border-spacing-0 text-left">
                <thead className="bg-blue-950 text-white">
                  <tr>
                    <th className="px-4 py-3">Loan ID</th>
                    <th className="px-4 py-3">Application ID</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Staff ID</th>
                    <th className="px-4 py-3">Start Date</th>
                    <th className="px-4 py-3">End Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Interest Rate</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loanList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4">
                        No loans yet
                      </td>
                    </tr>
                  ) : (
                    loanList.map((l, idx) => (
                      <tr
                        key={l.loan_id}
                        className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}
                      >
                        <td className="px-4 py-3">{l.loan_id}</td>
                        <td className="px-4 py-3">{l.loan_application_id}</td>
                        <td className="px-4 py-3">{Number(l.loan_amount).toLocaleString()}</td>
                        <td className="px-4 py-3">{l.staff_id}</td>
                        <td className="px-4 py-3">{formatDate(l.start_date)}</td>
                        <td className="px-4 py-3">{formatDate(l.end_date)}</td>
                        <td className="px-4 py-3">{l.status}</td>
                        <td className="px-4 py-3">{Number(l.interest_rate).toFixed(2)}%</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleEdit(l)} className="text-blue-600 hover:underline mr-2">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(l.loan_id)} className="text-red-600 hover:underline">
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
    </div>
  );
}
