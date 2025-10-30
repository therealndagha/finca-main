
import  { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Navbar from './Navbar';

const API_BASE = 'http://localhost:3000/api'; 

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emptyForm = {
    f_name: '',
    l_name: '',
    national_id_no: '',
    customer_type: '',
    phone_no: '',
    address: '',
    email: '',
    branch_id: '',
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/customers`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch');
      setCustomers(json.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const required = ['f_name', 'l_name', 'national_id_no', 'customer_type', 'phone_no', 'address', 'branch_id'];
    for (const k of required) {
      if (!form[k as keyof typeof form]) {
        alert('Please fill required fields.');
        return;
      }
    }

    setSaving(true);
    try {
      const url = editingId ? `${API_BASE}/customers/${editingId}` : `${API_BASE}/customers`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Save failed');

      await fetchCustomers();
      setForm(emptyForm);
      setEditingId(null);
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + (err.message || 'Failed to save'));
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(id: number) {
    try {
      const res = await fetch(`${API_BASE}/customers/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch customer');
      setForm({
        f_name: json.data.f_name || '',
        l_name: json.data.l_name || '',
        national_id_no: json.data.national_id_no || '',
        customer_type: json.data.customer_type || '',
        phone_no: json.data.phone_no || '',
        address: json.data.address || '',
        email: json.data.email || '',
        branch_id: json.data.branch_id || '',
      });
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      alert('Error fetching customer: ' + (err.message || ''));
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this customer? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Delete failed');
      await fetchCustomers();
    } catch (err: any) {
      console.error(err);
      alert('Error deleting customer: ' + (err.message || ''));
    }
  }

  function handleCancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div>
      <Navbar />

      <div className="bg-blue-950 text-white py-5 pl-5 space-y-5">
        <h1 className="text-5xl font-roboto">Customers</h1>
        <p className="text-blue-100">Manage FINCA Malawi customers here</p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Form */}
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Customer' : 'Add Customer'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="f_name"
              value={form.f_name}
              onChange={handleChange}
              placeholder="First name*"
              className="border rounded px-3 py-2"
            />
            <input
              name="l_name"
              value={form.l_name}
              onChange={handleChange}
              placeholder="Last name*"
              className="border rounded px-3 py-2"
            />
            <input
              name="national_id_no"
              value={form.national_id_no}
              onChange={handleChange}
              placeholder="National ID*"
              className="border rounded px-3 py-2"
            />
            <input
              name="customer_type"
              value={form.customer_type}
              onChange={handleChange}
              placeholder="Customer type*"
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
          </div>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address*"
            className="border rounded px-3 py-2 w-full"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email (optional)"
            className="border rounded px-3 py-2 w-full"
          />
          <div>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Customer'}
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
        
        {/* Customers Table */}
<h3 className="text-3xl font-roboto mb-4 text-blue-950">All Customers</h3>
{loading && <div>Loading customers...</div>}
{error && <div className="text-red-600">Error: {error}</div>}
{!loading && !error && (
  <div className="overflow-x-auto">
    <table className="min-w-full text-left border-separate border-spacing-0 font-open-sans">
      <thead>
        <tr className="bg-blue-950 text-white font-inter">
          <th className="px-4 py-3 rounded-tl-2xl">ID</th>
          <th className="px-4 py-3">First</th>
          <th className="px-4 py-3">Last</th>
          <th className="px-4 py-3">National ID</th>
          <th className="px-4 py-3">Type</th>
          <th className="px-4 py-3">Phone</th>
          <th className="px-4 py-3">Branch</th>
          <th className="px-4 py-3">Email</th>
          <th className="px-4 py-3">Address</th>
          <th className="px-4 py-3 rounded-tr-2xl">Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.length === 0 && (
          <tr>
            <td colSpan={10} className="text-center py-4">
              No customers yet
            </td>
          </tr>
        )}
        {customers.map((c, idx) => (
          <tr
            key={c.customer_id}
            className={`${
              idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            } hover:bg-blue-50 transition`}
          >
            <td className="px-4 py-3 text-blue-950">{c.customer_id}</td>
            <td className="px-4 py-3">{c.f_name}</td>
            <td className="px-4 py-3">{c.l_name}</td>
            <td className="px-4 py-3">{c.national_id_no}</td>
            <td className="px-4 py-3">{c.customer_type}</td>
            <td className="px-4 py-3">{c.phone_no}</td>
            <td className="px-4 py-3">{c.branch_id}</td>
            <td className="px-4 py-3">{c.email || '—'}</td>
            <td className="px-4 py-3">{c.address}</td>
            <td className="px-4 py-3">
              <button
                onClick={() => handleEdit(c.customer_id)}
                className="text-blue-600 hover:underline mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c.customer_id)}
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
  );
}
