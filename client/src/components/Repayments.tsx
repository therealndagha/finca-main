import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type Repayment = {
  repayment_id: number;
  loan_id: number;
  repayment_date: string;
  amount_paid: number;
  balance: number;
  payment_method_id: number;
};

type FormState = {
  loan_id: string;
  amount_paid: string;
  payment_method_id: string;
};

export default function Repayments() {
  const emptyForm: FormState = {
    loan_id: "",
    amount_paid: "",
    payment_method_id: "",
  };

  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRepayments();
  }, []);

  async function fetchRepayments() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/repayments");
      const data = await res.json();
      if (data.success) {
        setRepayments(data.data);
        setError(null);
      } else {
        setError("Failed to fetch repayments");
      }
    } catch (err) {
      setError("Network error while fetching repayments");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("http://localhost:3000/api/repayments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loan_id: form.loan_id,
          repayment_date: new Date().toISOString().split("T")[0],
          amount_paid: form.amount_paid,
          payment_method_id: form.payment_method_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchRepayments();
        setForm(emptyForm);
        setError(null);
      } else {
        setError(data.message || "Failed to add repayment");
      }
    } catch (err) {
      setError("Network error while adding repayment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col">
        {/* blue header */}
        <div className="bg-blue-950 text-white py-5 pl-5 space-y-2">
          <h1 className="text-5xl font-roboto">Repayments</h1>
          <p className="font-inter">
            FINCA Malawi has{" "}
            {repayments && repayments.length > 0 ? (
              <span>{repayments.length}</span>
            ) : (
              "no"
            )}{" "}
            recorded repayments
          </p>
        </div>

        {/* form */}
        <div className="mx-auto max-w-7xl px-4 py-8 w-full">
          <h2 className="text-xl font-semibold mb-4">Add Repayment</h2>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="loan_id"
                value={form.loan_id}
                onChange={handleChange}
                placeholder="Loan ID*"
                className="border rounded px-3 py-2"
                required
              />
              <input
                name="amount_paid"
                value={form.amount_paid}
                onChange={handleChange}
                placeholder="Amount Paid*"
                className="border rounded px-3 py-2"
                required
              />
              <input
                name="payment_method_id"
                value={form.payment_method_id}
                onChange={handleChange}
                placeholder="Payment Method ID*"
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {saving ? "Saving..." : "Add Repayment"}
              </button>
            </div>
          </form>

          <h3 className="text-3xl font-roboto mb-4 text-blue-950">
            All Repayments
          </h3>
          {loading && (
            <div className="flex flex-row items-center justify-center mt-5">
              <p className="text-3xl">Loading repayments please wait...</p>
              <Spinner />
            </div>
          )}
          {error && <div className="text-red-600">Error: {error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-separate border-spacing-0 font-open-sans">
                <thead>
                  <tr className="bg-blue-950 text-white font-inter">
                    <th className="px-4 py-3 rounded-tl-2xl">Repayment ID</th>
                    <th className="px-4 py-3">Loan ID</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount Paid</th>
                    <th className="px-4 py-3">Balance</th>
                    <th className="px-4 py-3 rounded-tr-2xl">Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {repayments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No repayments yet
                      </td>
                    </tr>
                  )}
                  {repayments.map((r, idx) => (
                    <tr
                      key={r.repayment_id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 text-blue-950">
                        {r.repayment_id}
                      </td>
                      <td className="px-4 py-3">{r.loan_id}</td>
                      <td className="px-4 py-3">
                        {new Date(r.repayment_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{r.amount_paid}</td>
                      <td className="px-4 py-3">{r.balance}</td>
                      <td className="px-4 py-3">{r.payment_method_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
