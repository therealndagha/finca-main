import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type Complaint = {
  complaint_id: number;
  customer_id: number;
  complaint_text: string;
  status: "Open" | "Resolved" | "Dismissed";
  created_at: string;
};

export default function Complaints() {
  const emptyForm: Omit<Complaint, "complaint_id" | "created_at"> = {
    customer_id: 0,
    complaint_text: "",
    status: "Open",
  };

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/complaints");
      const data = await res.json();
      if (data.success) setComplaints(data.data);
      else setError("Failed to fetch complaints");
    } catch (err) {
      console.error(err);
      setError("Error fetching complaints");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "customer_id" ? parseInt(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `http://localhost:3000/api/complaints/${editingId}`
        : "http://localhost:3000/api/complaints";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchComplaints();
        setForm(emptyForm);
        setEditingId(null);
      } else setError("Failed to save complaint");
    } catch (err) {
      console.error(err);
      setError("Network error while saving complaint");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(c: Complaint) {
    setForm({
      customer_id: c.customer_id,
      complaint_text: c.complaint_text,
      status: c.status,
    });
    setEditingId(c.complaint_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/complaints/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success)
        setComplaints((prev) => prev.filter((c) => c.complaint_id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete complaint");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
  }

  // Stats
  const stats = {
    open: complaints.filter((c) => c.status === "Open").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
    dismissed: complaints.filter((c) => c.status === "Dismissed").length,
  };
  const total = complaints.length || 1;
  const percent = {
    open: ((stats.open / total) * 100).toFixed(1),
    resolved: ((stats.resolved / total) * 100).toFixed(1),
    dismissed: ((stats.dismissed / total) * 100).toFixed(1),
  };

  return (
    <div>
      <Navbar />

      {/* Header */}
      <div className="bg-blue-950 text-white py-6 px-6 space-y-2">
        <h1 className="text-5xl font-roboto">Customer Complaints</h1>
        <p className="font-inter text-lg opacity-90">
          Track and manage all customer complaints efficiently
        </p>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 mt-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-yellow-700">Open</h3>
          <p className="text-3xl font-bold">{stats.open}</p>
          <p className="text-sm text-yellow-600">{percent.open}% of total</p>
        </div>
        <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-700">Resolved</h3>
          <p className="text-3xl font-bold">{stats.resolved}</p>
          <p className="text-sm text-green-600">{percent.resolved}% of total</p>
        </div>
        <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-red-700">Dismissed</h3>
          <p className="text-3xl font-bold">{stats.dismissed}</p>
          <p className="text-sm text-red-600">{percent.dismissed}% of total</p>
        </div>
      </div>

      {/* Complaint Form */}
      <div className="my-6 px-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-4 rounded shadow-md max-w-3xl"
        >
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Complaint" : "Add Complaint"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Customer ID</label>
              <input
                type="number"
                name="customer_id"
                value={form.customer_id || ""}
                onChange={handleChange}
                placeholder="Customer ID"
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              >
                <option value="Open">Open</option>
                <option value="Resolved">Resolved</option>
                <option value="Dismissed">Dismissed</option>
              </select>
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium mb-1">Complaint</label>
              <textarea
                name="complaint_text"
                value={form.complaint_text}
                onChange={handleChange}
                placeholder="Enter complaint details"
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
                ? "Update Complaint"
                : "Add Complaint"}
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
          {collapsed ? "Expand Complaints Table" : "Collapse Complaints Table"}
        </button>
      </div>

      {/* Complaints Table */}
      {!collapsed && (
        <div className="overflow-x-auto mx-6 my-6 bg-white rounded-lg shadow-md">
          {loading ? (
            <Spinner />
          ) : (
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Customer ID</th>
                  <th className="px-4 py-3">Complaint</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6">
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  complaints.map((c, idx) => (
                    <tr
                      key={c.complaint_id}
                      className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">{c.complaint_id}</td>
                      <td className="px-4 py-3 text-gray-700">{c.customer_id}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-xl truncate">{c.complaint_text}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          c.status === "Open" ? "bg-yellow-200 text-yellow-800" :
                          c.status === "Resolved" ? "bg-green-200 text-green-800" :
                          "bg-red-200 text-red-800"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(c)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.complaint_id)}
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
