'use client';

import { useState } from 'react';
import api from '../lib/api';
import { getHubConnection } from '../lib/signalr';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

export default function LogMealPage() {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) return alert('Please login first');
    const user = JSON.parse(userData);

    if (!name || !calories) return alert('Please fill all fields');

    try {
      setLoading(true);

      const payload = { userId: user.id, name, calories: Number(calories) };
      await api.post('/meal/log', payload);

      // ✅ SignalR
      const hub = getHubConnection();
      await hub.start().catch(() => {}); // Ignore if already started
      await hub.invoke('BroadcastActivity', user.id, 'meal', `${name} (${calories} kcal)`);

      alert('Meal logged successfully 🍽️');
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error logging meal');
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
          <Coffee className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-700">Log Your Meal</h1>
        </div>

        {/* Meal Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Name
          </label>
          <input
            type="text"
            placeholder="e.g. Chicken Salad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 outline-none transition-all"
          />
        </div>

        {/* Calories */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Calories
          </label>
          <input
            type="number"
            placeholder="e.g. 350"
            value={calories}
            onChange={(e) => setCalories(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 outline-none transition-all"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition-all ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging...' : 'Log Meal'}
        </motion.button>

        {/* Footer */}
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
