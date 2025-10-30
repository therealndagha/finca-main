// src/components/Loans.tsx
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
  status: string;
};

type LoanForm = Omit<Loan, "loan_id">;

export default function Loans() {
  const emptyForm: LoanForm = {
    loan_application_id: 0,
    loan_amount: 0,
    staff_id: 1,
    start_date: "",
    end_date: "",
    status: "Active",
  };

  const [loanList, setLoanList] = useState<Loan[]>([]);
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
      const res = await fetch("http://localhost:3000/api/loans");
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "loan_amount" || name === "loan_application_id"
          ? parseFloat(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `http://localhost:3000/api/loans/${editingId}`
        : "http://localhost:3000/api/loans";
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
      } else setError("Failed to save loan");
    } catch {
      setError("Network error while saving loan");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(loan: Loan) {
    setForm({ ...loan });
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
      if (data.success)
        setLoanList((prev) => prev.filter((l) => l.loan_id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete loan");
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
          <h1 className="text-5xl font-roboto">Loans</h1>
          <p className="font-inter">Manage customer loans</p>
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
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Loan Application ID
                </label>
                <input
                  name="loan_application_id"
                  value={form.loan_application_id || ""}
                  onChange={handleChange}
                  type="number"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Loan Amount
                </label>
                <input
                  name="loan_amount"
                  value={form.loan_amount || ""}
                  onChange={handleChange}
                  type="number"
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Start Date
                </label>
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

        {/* Table */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto mx-5">
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
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loanList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      No loans yet
                    </td>
                  </tr>
                ) : (
                  loanList.map((l, idx) => (
                    <tr
                      key={l.loan_id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3">{l.loan_id}</td>
                      <td className="px-4 py-3">{l.loan_application_id}</td>
                      <td className="px-4 py-3">
                        {l.loan_amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{l.staff_id}</td>
                      <td className="px-4 py-3">{l.start_date}</td>
                      <td className="px-4 py-3">{l.end_date}</td>
                      <td className="px-4 py-3">{l.status}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(l)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(l.loan_id)}
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
