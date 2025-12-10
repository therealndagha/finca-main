import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Navbar from './Navbar';

const API_BASE = 'http://localhost:3000/api'; 

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(true); // table collapsed by default

  const emptyForm = {
    f_name: '',
    l_name: '',
    national_id_no: '',
    customer_type: '',
    phone_no: '',
    address: '',
    email: '',
    branch_id: '',
    gender: '',
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

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const required = ['f_name', 'l_name', 'national_id_no', 'customer_type', 'phone_no', 'address', 'branch_id', 'gender'];
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
        gender: json.data.gender || '',
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

  // Statistics
  const totalCustomers = customers.length;
  const maleCount = customers.filter(c => c.gender === 'm').length;
  const femaleCount = customers.filter(c => c.gender === 'f').length;

  return (
    <div>
      <Navbar />
      <div className="bg-blue-950 text-white py-5 pl-5 space-y-5 mb-4">
        <h1 className="text-5xl font-roboto">Customers</h1>
        <p className="text-blue-100">Manage FINCA Malawi customers here</p>
      </div>

      {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 mb-4">
          <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-purple-700">Total Customers</h3>
            <p className="text-3xl font-bold">{totalCustomers-1}</p>
          </div>
          <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-green-700">Male Customers</h3>
            <p className="text-3xl font-bold">{maleCount+1}</p>
          </div>
          <div className="bg-pink-100 border-l-4 border-pink-600 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-pink-700">Female Customers</h3>
            <p className="text-3xl font-bold">{femaleCount}</p>
          </div>
        </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Form */}
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Customer' : 'Add Customer'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="f_name" value={form.f_name} onChange={handleChange} placeholder="First name*" className="border rounded px-3 py-2" />
            <input name="l_name" value={form.l_name} onChange={handleChange} placeholder="Last name*" className="border rounded px-3 py-2" />
            <input name="national_id_no" value={form.national_id_no} onChange={handleChange} placeholder="National ID*" className="border rounded px-3 py-2" />
            <input name="customer_type" value={form.customer_type} onChange={handleChange} placeholder="Customer type*" className="border rounded px-3 py-2" />
            <input name="phone_no" value={form.phone_no} onChange={handleChange} placeholder="Phone number*" className="border rounded px-3 py-2" />
            <input name="branch_id" value={form.branch_id} onChange={handleChange} placeholder="Branch ID*" className="border rounded px-3 py-2" />
            <select name="gender" value={form.gender} onChange={handleChange} className="border rounded px-3 py-2">
              <option value="">Select Gender*</option>
              <option value="m">Male</option>
              <option value="f">Female</option>
            </select>
          </div>
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address*" className="border rounded px-3 py-2 w-full" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email (optional)" className="border rounded px-3 py-2 w-full" />

          <div>
            <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Customer'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="ml-3 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
            )}
          </div>
        </form>

        

        {/* Collapse / Expand Button */}
        <div className="px-6 mb-2">
          <button
            onClick={() => setCollapsed(prev => !prev)}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            {collapsed ? 'Show Customers Table' : 'Hide Customers Table'}
          </button>
        </div>

        {/* Customers Table */}
        {!collapsed && (
          <div className="overflow-x-auto">
            {loading ? (
              <div>Loading customers...</div>
            ) : error ? (
              <div className="text-red-600">Error: {error}</div>
            ) : (
              <table className="min-w-full text-left border-separate border-spacing-0 font-open-sans">
                <thead>
                  <tr className="bg-blue-950 text-white font-inter">
                    <th className="px-4 py-3 rounded-tl-2xl">ID</th>
                    <th className="px-4 py-3">Fname</th>
                    <th className="px-4 py-3">Lname</th>
                    <th className="px-4 py-3">National ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Branch</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Gender</th>
                    <th className="px-4 py-3 rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={11} className="text-center py-4">No customers yet</td>
                    </tr>
                  )}
                  {customers.map((c, idx) => (
                    <tr key={c.customer_id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}>
                      <td className="px-4 py-3 text-blue-950">{c.customer_id}</td>
                      <td className="px-4 py-3">{c.f_name}</td>
                      <td className="px-4 py-3">{c.l_name}</td>
                      <td className="px-4 py-3">{c.national_id_no}</td>
                      <td className="px-4 py-3">{c.customer_type}</td>
                      <td className="px-4 py-3">{c.phone_no}</td>
                      <td className="px-4 py-3">{c.branch_id}</td>
                      <td className="px-4 py-3">{c.email || '—'}</td>
                      <td className="px-4 py-3">{c.address}</td>
                      <td className="px-4 py-3">{c.gender}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleEdit(c.customer_id)} className="text-blue-600 hover:underline mr-2">Edit</button>
                        <button onClick={() => handleDelete(c.customer_id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
