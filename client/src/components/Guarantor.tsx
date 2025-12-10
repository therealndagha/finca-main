import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type Guarantor = {
  guarantor_id: number;
  f_name: string;
  l_name: string;
  national_id_no: string;
  phone_no: string;
  address: string;
  email?: string;
  created_at: string;
};

export default function Guarantors() {
  const emptyForm: Omit<Guarantor, "guarantor_id" | "created_at"> = {
    f_name: "",
    l_name: "",
    national_id_no: "",
    phone_no: "",
    address: "",
    email: "",
  };

  const [records, setRecords] = useState<Guarantor[]>([]);
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
      const res = await fetch("http://localhost:3000/api/guarantors");
      const data = await res.json();
      if (data.success) setRecords(data.data);
      else setError("Failed to fetch guarantors");
    } catch (err) {
      console.error(err);
      setError("Error fetching guarantors");
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
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `http://localhost:3000/api/guarantors/${editingId}`
        : "http://localhost:3000/api/guarantors";
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

  function handleEdit(record: Guarantor) {
    setForm({
      f_name: record.f_name,
      l_name: record.l_name,
      national_id_no: record.national_id_no,
      phone_no: record.phone_no,
      address: record.address,
      email: record.email || "",
    });
    setEditingId(record.guarantor_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this guarantor?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/guarantors/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success)
        setRecords((prev) => prev.filter((r) => r.guarantor_id !== id));
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
  const totalGuarantors = records.length;

  return (
    <div>
      <Navbar />

      {/* Header */}
      <div className="bg-blue-950 text-white py-6 px-6 space-y-2">
        <h1 className="text-5xl font-roboto">Guarantors</h1>
        <p className="font-inter text-lg opacity-90">
          Manage all guarantors efficiently
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 px-6 mt-6">
        <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-purple-700">Total Guarantors</h3>
          <p className="text-3xl font-bold">{totalGuarantors}</p>
        </div>
      </div>

      {/* Form */}
      <div className="my-6 px-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-4 rounded shadow-md max-w-3xl"
        >
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Guarantor" : "Add Guarantor"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">First Name</label>
              <input
                name="f_name"
                value={form.f_name}
                onChange={handleChange}
                placeholder="First Name"
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Last Name</label>
              <input
                name="l_name"
                value={form.l_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">National ID</label>
              <input
                name="national_id_no"
                value={form.national_id_no}
                onChange={handleChange}
                placeholder="National ID"
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Phone Number</label>
              <input
                name="phone_no"
                value={form.phone_no}
                onChange={handleChange}
                placeholder="Phone Number"
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium mb-1">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium mb-1">Email (Optional)</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
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
          {collapsed ? "Expand Guarantor Table" : "Collapse Guarantor Table"}
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
                  <th className="px-4 py-3">First Name</th>
                  <th className="px-4 py-3">Last Name</th>
                  <th className="px-4 py-3">National ID</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6">
                      No guarantors found
                    </td>
                  </tr>
                ) : (
                  records.map((r, idx) => (
                    <tr
                      key={r.guarantor_id}
                      className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">{r.guarantor_id}</td>
                      <td className="px-4 py-3 text-gray-700">{r.f_name}</td>
                      <td className="px-4 py-3 text-gray-700">{r.l_name}</td>
                      <td className="px-4 py-3 text-gray-700">{r.national_id_no}</td>
                      <td className="px-4 py-3 text-gray-700">{r.phone_no}</td>
                      <td className="px-4 py-3 text-gray-700">{r.address}</td>
                      <td className="px-4 py-3 text-gray-700">{r.email || "—"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(r)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r.guarantor_id)}
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
