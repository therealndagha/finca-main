import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type PaymentMethod = {
  method_id: number;
  method_name: string;
  description?: string;
  is_active: 0 | 1;
  created_at: string;
};

export default function PaymentMethods() {
  const emptyForm: Omit<PaymentMethod, "method_id" | "created_at"> = {
    method_name: "",
    description: "",
    is_active: 1,
  };

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  async function fetchMethods() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/payment_methods");
      const data = await res.json();
      if (data.success) setMethods(data.data);
      else setError("Failed to fetch payment methods");
    } catch (err) {
      console.error(err);
      setError("Error fetching payment methods");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `http://localhost:3000/api/payment_methods/${editingId}`
        : "http://localhost:3000/api/payment_methods";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchMethods();
        setForm(emptyForm);
        setEditingId(null);
      } else setError("Failed to save method");
    } catch (err) {
      console.error(err);
      setError("Network error while saving method");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(method: PaymentMethod) {
    setForm({
      method_name: method.method_name,
      description: method.description,
      is_active: method.is_active,
    });
    setEditingId(method.method_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this payment method?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/payment_methods/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success)
        setMethods((prev) => prev.filter((m) => m.method_id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete method");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
  }

  // Stats
  const totalMethods = methods.length;
  const activeMethods = methods.filter((m) => m.is_active === 1).length;
  const inactiveMethods = totalMethods - activeMethods;

  return (
    <div>
      <Navbar />

      {/* Header */}
      <div className="bg-blue-950 text-white py-6 px-6 space-y-2">
        <h1 className="text-5xl font-roboto">Payment Methods</h1>
        <p className="font-inter text-lg opacity-90">
          Manage all payment methods in the system
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 mt-6">
        <div className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-blue-700">Total Methods</h3>
          <p className="text-3xl font-bold">{totalMethods}</p>
        </div>
        <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-700">Active</h3>
          <p className="text-3xl font-bold">{activeMethods}</p>
        </div>
        <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-red-700">Inactive</h3>
          <p className="text-3xl font-bold">{inactiveMethods}</p>
        </div>
      </div>

      {/* Form */}
      <div className="my-6 px-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-4 rounded shadow-md max-w-3xl"
        >
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Payment Method" : "Add Payment Method"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Method Name</label>
              <input
                name="method_name"
                value={form.method_name}
                onChange={handleChange}
                placeholder="Enter method name"
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Description</label>
              <input
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                placeholder="Enter description"
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex items-center mt-2 md:mt-6">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active === 1}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Active</span>
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
          {collapsed ? "Expand Table" : "Collapse Table"}
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
                  <th className="px-4 py-3">Method Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {methods.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6">
                      No payment methods
                    </td>
                  </tr>
                ) : (
                  methods.map((m, idx) => (
                    <tr
                      key={m.method_id}
                      className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">{m.method_id}</td>
                      <td className="px-4 py-3 text-gray-700">{m.method_name}</td>
                      <td className="px-4 py-3 text-gray-700">{m.description || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            m.is_active
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {m.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(m)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(m.method_id)}
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
