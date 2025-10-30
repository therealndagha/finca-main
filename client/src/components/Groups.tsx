import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type Group = {
  group_id: number;
  group_name: string;
  group_type: string;
  phone_no: string;
  address: string;
  branch_id: string;
};

export default function Groups() {
  const emptyForm: Omit<Group, "group_id"> = {
    group_name: "",
    group_type: "",
    phone_no: "",
    address: "",
    branch_id: "",
  };

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/group");
      const data = await res.json();
      if (data.success) {
        setGroups(data.data);
        setError(null);
      } else {
        setError("Failed to fetch groups");
      }
    } catch (err) {
      setError("Network error while fetching groups");
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
        ? `http://localhost:3000/api/group/${editingId}`
        : "http://localhost:3000/api/group";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchGroups();
        setForm(emptyForm);
        setEditingId(null);
        setError(null);
      } else {
        setError("Failed to save group");
      }
    } catch (err) {
      setError("Network error while saving group");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(id: number) {
    const g = groups.find((gr) => gr.group_id === id);
    if (g) {
      setForm({
        group_name: g.group_name,
        group_type: g.group_type,
        phone_no: g.phone_no,
        address: g.address,
        branch_id: g.branch_id,
      });
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this group? This action cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/group/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setGroups((prev) => prev.filter((g) => g.group_id !== id));
      } else {
        setError("Failed to delete group");
      }
    } catch (err) {
      setError("Network error while deleting group");
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
          <h1 className="text-5xl font-roboto">Groups</h1>
          <p className="font-inter">
            FINCA MALAWI has{" "}
            {groups && groups.length > 0 ? (
              <span>{groups.length}</span>
            ) : (
              "no"
            )}{" "}
            registered groups
          </p>
        </div>

        {/* form */}
        <div className="mx-auto max-w-7xl px-4 py-8 w-full">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Group" : "Add Group"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="group_name"
                value={form.group_name}
                onChange={handleChange}
                placeholder="Group name*"
                className="border rounded px-3 py-2"
              />
              <input
                name="group_type"
                value={form.group_type}
                onChange={handleChange}
                placeholder="Group type*"
                className="border rounded px-3 py-2"
              />
              <input
                name="phone_no"
                value={form.phone_no}
                onChange={handleChange}
                placeholder="Phone number*"
                className="border rounded px-3 py-2"
              />
              <input
                name="branch_id"
                value={form.branch_id}
                onChange={handleChange}
                placeholder="Branch ID*"
                className="border rounded px-3 py-2"
              />
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address*"
                className="border rounded px-3 py-2 md:col-span-2"
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
                  ? "Update Group"
                  : "Add Group"}
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

          <h3 className="text-3xl font-roboto mb-4 text-blue-950">All Groups</h3>
          {loading && (
            <div className="flex flex-row items-center justify-center mt-5">
              <p className="text-3xl">Loading groups please wait...</p>
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
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Branch</th>
                    <th className="px-4 py-3 rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-4">
                        No groups yet
                      </td>
                    </tr>
                  )}
                  {groups.map((g, idx) => (
                    <tr
                      key={g.group_id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 text-blue-950">{g.group_id}</td>
                      <td className="px-4 py-3">{g.group_name}</td>
                      <td className="px-4 py-3">{g.group_type}</td>
                      <td className="px-4 py-3">{g.phone_no}</td>
                      <td className="px-4 py-3">{g.address}</td>
                      <td className="px-4 py-3">{g.branch_id}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(g.group_id)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(g.group_id)}
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
