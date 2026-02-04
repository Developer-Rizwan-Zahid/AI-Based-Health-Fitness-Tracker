'use client';

import { useState } from 'react';
import api from '../lib/api';
import { getHubConnection } from '../lib/signalr';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

export default function LogWorkoutPage() {
  const [type, setType] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) return alert('Please login first');
    const user = JSON.parse(userData);

    if (!type || !duration) return alert('Please fill all fields');

    try {
      setLoading(true);
      const payload = { userId: user.id, type, durationMinutes: Number(duration) };
      await api.post('/workout/log', payload);

      // ✅ SignalR
      const hub = getHubConnection();
      await hub.start().catch(() => {});
      await hub.invoke('BroadcastActivity', user.id, 'workout', `${type} (${duration} min)`);

      alert('Workout logged successfully ✅');
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error logging workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Dumbbell className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-700">Log Your Workout</h1>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workout Type
            </label>
            <input
              type="text"
              placeholder="e.g. Running, Cycling"
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              placeholder="e.g. 45"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 outline-none transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          onClick={handleSubmit}
          className={`mt-6 w-full py-3 rounded-xl text-white font-semibold shadow-md transition-all ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging...' : 'Log Workout'}
        </motion.button>

        {/* Footer Link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>
        </p>
      </motion.div>
    </div>
  );
}
