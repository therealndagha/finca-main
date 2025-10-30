
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type Role = {
  role_id: number;
  role_name: string;
  role_description: string;
};

export default function Roles() {
  const emptyForm: Omit<Role, "role_id"> = { role_name: "", role_description: "" };

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/role");
      const data = await res.json();
      if (data.success) setRoles(data.data);
      else setError("Failed to fetch roles");
    } catch {
      setError("Network error while fetching roles");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `http://localhost:3000/api/role/${editingId}`
        : "http://localhost:3000/api/role";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchRoles();
        setForm(emptyForm);
        setEditingId(null);
      } else setError("Failed to save role");
    } catch {
      setError("Network error while saving role");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(id: number) {
    const r = roles.find((r) => r.role_id === id);
    if (r) {
      setForm({ role_name: r.role_name, role_description: r.role_description });
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this role? This action cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/role/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setRoles((prev) => prev.filter((r) => r.role_id !== id));
      else setError("Failed to delete role");
    } catch {
      setError("Network error while deleting role");
    }
  }

  function handleCancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col">
        <div className="bg-blue-950 text-white py-5 pl-5 space-y-2">
          <h1 className="text-5xl font-roboto">Roles</h1>
          <p className="font-inter">
            Manage staff roles in FINCA Malawi
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 w-full">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Role" : "Add Role"}</h2>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <input
              name="role_name"
              value={form.role_name}
              onChange={handleChange}
              placeholder="Role Name*"
              className="border rounded px-3 py-2 w-full"
            />
            <textarea
              name="role_description"
              value={form.role_description}
              onChange={handleChange}
              placeholder="Role Description*"
              className="border rounded px-3 py-2 w-full"
            />
            <div>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {saving ? "Saving..." : editingId ? "Update Role" : "Add Role"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="ml-3 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <h3 className="text-3xl font-roboto mb-4 text-blue-950">All Roles</h3>
          {loading && (
            <div className="flex flex-row items-center justify-center mt-5">
              <p className="text-3xl">Loading roles...</p>
              <Spinner />
            </div>
          )}
          {error && <div className="text-red-600">Error: {error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-separate border-spacing-0 font-open-sans">
                <thead>
                  <tr className="bg-blue-950 text-white font-inter">
                    <th className="px-4 py-3 rounded-tl-2xl">ID</th>
                    <th className="px-4 py-3">Role Name</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        No roles yet
                      </td>
                    </tr>
                  )}
                  {roles.map((r, idx) => (
                    <tr key={r.role_id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}>
                      <td className="px-4 py-3 text-blue-950">{r.role_id}</td>
                      <td className="px-4 py-3">{r.role_name}</td>
                      <td className="px-4 py-3">{r.role_description}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleEdit(r.role_id)} className="text-blue-600 hover:underline mr-2">Edit</button>
                        <button onClick={() => handleDelete(r.role_id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
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
