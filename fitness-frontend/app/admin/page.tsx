'use client';

import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Trash2, Edit2, Users, Activity, Coffee, Moon, X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: number;
  name: string;
  email: string;
  goal: string;
  weight: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  // Edit + Add modals
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [addingUser, setAddingUser] = useState(false);

  const [saving, setSaving] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', goal: '' });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, a] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/analytics'),
        ]);
        setUsers(u.data);
        setAnalytics(a.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Delete User
  const deleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      setDeletingUserId(id);
      await api.delete(`/admin/user/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      toast.success('User deleted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete user.');
    } finally {
      setDeletingUserId(null);
    }
  };

  // Update User
  const handleEditSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const res = await api.put(`/admin/user/${editingUser.id}`, editingUser);
      setUsers(users.map((u) => (u.id === editingUser.id ? res.data : u)));
      toast.success('User updated successfully!');
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  // Add New User
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Name and Email are required.');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/admin/user', {
        ...newUser,
      });
      setUsers([...users, res.data]);
      toast.success('User added successfully!');
      setAddingUser(false);
      setNewUser({ name: '', email: '', goal: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to add user.');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading admin dashboard...</p>
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-blue-700">Admin Dashboard</h1>
        <Button
          onClick={() => setAddingUser(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Users', icon: Users, color: 'blue', value: analytics.totalUsers },
            { label: 'Total Workouts', icon: Activity, color: 'green', value: analytics.totalWorkouts },
            { label: 'Total Meals', icon: Coffee, color: 'yellow', value: analytics.totalMeals },
            { label: 'Sleep Records', icon: Moon, color: 'purple', value: analytics.totalSleepRecords },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-xl shadow bg-${item.color}-50 flex items-center gap-4`}
            >
              <item.icon className={`w-8 h-8 text-${item.color}-600`} />
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Users Table */}
      <div className="border rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left border-b">ID</th>
              <th className="px-4 py-3 text-left border-b">Name</th>
              <th className="px-4 py-3 text-left border-b">Email</th>
              <th className="px-4 py-3 text-left border-b">Goal</th>
              <th className="px-4 py-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <motion.tr
                key={u.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="border-b"
              >
                <td className="px-4 py-3">{u.id}</td>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.goal}</td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <Button
                    onClick={() => setEditingUser(u)}
                    className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </Button>
                  <Button
                    onClick={() => deleteUser(u.id)}
                    disabled={deletingUserId === u.id}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />{' '}
                    {deletingUserId === u.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <Modal onClose={() => setEditingUser(null)} title={`Edit User #${editingUser.id}`}>
            <Form
              user={editingUser}
              setUser={setEditingUser}
              onSubmit={handleEditSave}
              saving={saving}
              buttonText="Save Changes"
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {addingUser && (
          <Modal onClose={() => setAddingUser(false)} title="Add New User">
            <Form
              user={newUser}
              setUser={setNewUser}
              onSubmit={handleAddUser}
              saving={saving}
              buttonText="Add User"
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
function Modal({ title, onClose, children }: any) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <button
          className="absolute top-0 right-3 text-gray-400 hover:text-gray-800"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{title}</h2>
        {children}
      </motion.div>
    </motion.div>
  );
}
function Form({ user, setUser, onSubmit, saving, buttonText }: any) {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Name"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="email"
        placeholder="Email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="text"
        placeholder="Goal"
        value={user.goal}
        onChange={(e) => setUser({ ...user, goal: e.target.value })}
        className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
      />
      <Button
        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
        onClick={onSubmit}
        disabled={saving}
      >
        {saving ? 'Saving...' : buttonText}
      </Button>
    </div>
  );
}
