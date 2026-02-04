'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { Loader2, User, Save, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

type UserProfile = {
  id: number;
  name: string;
  email: string;
  goal?: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/user/me');
      setProfile(res.data);
      setName(res.data.name || '');
      setGoal(res.data.goal ?? '');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          goal: res.data.goal,
        })
      );
    } catch (err: any) {
      console.error('Failed to load profile', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } else {
        setError('Unable to load profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setSaving(true);
    try {
      const payload = { name: name.trim(), goal: goal.trim() || null };
      const res = await api.put('/user', payload);
      const updated = res.data;
      setProfile(updated);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: updated.id,
          name: updated.name,
          email: updated.email,
          goal: updated.goal,
        })
      );
      toast.success('Profile updated successfully 🎉');
    } catch (err: any) {
      console.error('Error updating profile', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="ml-3 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Your Profile</h1>
          <p className="text-sm text-gray-500">Manage your personal details & goals</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50 text-gray-500 cursor-not-allowed"
            value={profile?.email ?? ''}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Goal (e.g. Lose weight, Maintain weight)
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Your health or fitness goal"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setName(profile?.name ?? '');
            setGoal(profile?.goal ?? '');
            toast('Reset to previous values', { icon: '↩️' });
          }}
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
