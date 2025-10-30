import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";

type Staff = {
  staff_id: number;
  branch_id: number;
  role_id: number;
  role_name: string;
  f_name: string;
  l_name: string;
  email: string;
  phone_no: string;
  address: string;
};

type Role = { role_id: number; role_name: string };

export default function StaffPage() {
  const emptyForm: Omit<Staff, "staff_id" | "role_name"> = {
    branch_id: 1,
    role_id: 11,
    f_name: "",
    l_name: "",
    email: "",
    phone_no: "",
    address: "",
  };

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
    fetchStaff();
  }, []);

  async function fetchRoles() {
    try {
      const res = await fetch("http://localhost:3000/api/role");
      const data = await res.json();
      if (data.success) setRoles(data.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchStaff() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/staff");
      const data = await res.json();
      if (data.success) setStaffList(data.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching staff");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `http://localhost:3000/api/staff/${editingId}`
        : "http://localhost:3000/api/staff";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchStaff();
        setForm(emptyForm);
        setEditingId(null);
      } else setError("Failed to save staff");
    } catch {
      setError("Network error while saving staff");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(staff: Staff) {
    setForm({
      branch_id: staff.branch_id,
      role_id: staff.role_id,
      f_name: staff.f_name,
      l_name: staff.l_name,
      email: staff.email,
      phone_no: staff.phone_no,
      address: staff.address,
    });
    setEditingId(staff.staff_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this staff?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/staff/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setStaffList(prev => prev.filter(s => s.staff_id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete staff");
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
        <div className="bg-blue-950 text-white py-5 pl-5 space-y-2">
          <h1 className="text-5xl font-roboto">Staff</h1>
          <p className="font-inter">Manage FINCA Malawi staff</p>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 w-full">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Staff" : "Add Staff"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="f_name"
                value={form.f_name}
                onChange={handleChange}
                placeholder="First Name*"
                className="border rounded px-3 py-2"
              />
              <input
                name="l_name"
                value={form.l_name}
                onChange={handleChange}
                placeholder="Last Name*"
                className="border rounded px-3 py-2"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="border rounded px-3 py-2"
              />
              <input
                name="phone_no"
                value={form.phone_no}
                onChange={handleChange}
                placeholder="Phone Number*"
                className="border rounded px-3 py-2"
              />
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address*"
                className="border rounded px-3 py-2 md:col-span-2"
              />
              <input
                name="branch_id"
                value={form.branch_id}
                onChange={handleChange}
                placeholder="Branch ID*"
                className="border rounded px-3 py-2"
              />
              <select
                name="role_id"
                value={form.role_id}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              >
                {roles.map(r => (
                  <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {saving ? "Saving..." : editingId ? "Update Staff" : "Add Staff"}
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

          <h3 className="text-3xl font-roboto mb-4 text-blue-950">All Staff</h3>
          {loading && <div>Loading staff...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-separate border-spacing-0 font-open-sans">
                <thead>
                  <tr className="bg-blue-950 text-white font-inter">
                    <th className="px-4 py-3 rounded-tl-2xl">ID</th>
                    <th className="px-4 py-3">First</th>
                    <th className="px-4 py-3">Last</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Branch</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-4">
                        No staff yet
                      </td>
                    </tr>
                  )}
                  {staffList.map((s, idx) => (
                    <tr key={s.staff_id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}>
                      <td className="px-4 py-3 text-blue-950">{s.staff_id}</td>
                      <td className="px-4 py-3">{s.f_name}</td>
                      <td className="px-4 py-3">{s.l_name}</td>
                      <td className="px-4 py-3">{s.email || "—"}</td>
                      <td className="px-4 py-3">{s.phone_no}</td>
                      <td className="px-4 py-3">{s.address}</td>
                      <td className="px-4 py-3">{s.branch_id}</td>
                      <td className="px-4 py-3">{s.role_name}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(s)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.staff_id)}
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
