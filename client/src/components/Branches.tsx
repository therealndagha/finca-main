import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type Branch = {
  branch_id: number;
  branch_name: string;
  location: string;
  phone_no: string;
};

export default function Branches() {
  const emptyForm: Omit<Branch, "branch_id"> = {
    branch_name: "",
    location: "",
    phone_no: "",
  };

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  async function fetchBranches() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/branch");
      const data = await res.json();
      if (data.success) {
        setBranches(data.data);
        setError(null);
      } else {
        setError("Failed to fetch branches");
      }
    } catch (err) {
      setError("Network error while fetching branches");
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
      const url = editingId
        ? `http://localhost:3000/api/branch/${editingId}`
        : "http://localhost:3000/api/branch";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBranches();
        setForm(emptyForm);
        setEditingId(null);
        setError(null);
      } else {
        setError("Failed to save branch");
      }
    } catch (err) {
      setError("Network error while saving branch");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(id: number) {
    const b = branches.find((br) => br.branch_id === id);
    if (b) {
      setForm({
        branch_name: b.branch_name,
        location: b.location,
        phone_no: b.phone_no,
      });
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this branch? This action cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/branch/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBranches((prev) => prev.filter((b) => b.branch_id !== id));
      } else {
        setError("Failed to delete branch");
      }
    } catch (err) {
      setError("Network error while deleting branch");
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
        {/* blue header */}
        <div className="bg-blue-950 text-white py-5 pl-5 space-y-2">
          <h1 className="text-5xl font-roboto">Branches</h1>
          <p className="font-inter">
            FINCA Malawi has{" "}
            {branches && branches.length > 0 ? (
              <span>{branches.length}</span>
            ) : (
              "no"
            )}{" "}
            registered branches
          </p>
        </div>

        {/* form */}
        <div className="mx-auto max-w-7xl px-4 py-8 w-full">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Branch" : "Add Branch"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="branch_name"
                value={form.branch_name}
                onChange={handleChange}
                placeholder="Branch name*"
                className="border rounded px-3 py-2"
              />
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location*"
                className="border rounded px-3 py-2"
              />
              <input
                name="phone_no"
                value={form.phone_no}
                onChange={handleChange}
                placeholder="Phone number*"
                className="border rounded px-3 py-2"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Branch"
                  : "Add Branch"}
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

          <h3 className="text-3xl font-roboto mb-4 text-blue-950">All Branches</h3>
          {loading && (
            <div className="flex flex-row items-center justify-center mt-5">
              <p className="text-3xl">Loading branches please wait...</p>
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
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3 rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No branches yet
                      </td>
                    </tr>
                  )}
                  {branches.map((b, idx) => (
                    <tr
                      key={b.branch_id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 text-blue-950">{b.branch_id}</td>
                      <td className="px-4 py-3">{b.branch_name}</td>
                      <td className="px-4 py-3">{b.location}</td>
                      <td className="px-4 py-3">{b.phone_no}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(b.branch_id)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b.branch_id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
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
