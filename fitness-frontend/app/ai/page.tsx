'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AIRecommendation {
  suggestedWorkout: string;
  recommendedCalories: number;
  dietTip: string;
  sleepAdvice: string;
  weeklyWorkouts: { day: string; duration: number }[];
  weeklyCalories: { day: string; calories: number }[];
  weeklySleep: { day: string; hours: number }[];
}

//Card component
function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all"
    >
      {children}
    </motion.div>
  );
}

//Button component
function Button({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
    >
      {children}
    </button>
  );
}

export default function AIRecommendationsPage() {
  const [data, setData] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const fetchRecommendations = async () => {
    if (!user?.id) {
      setError('User not logged in');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/ai/recommend/${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      const result = await res.json();
      setData(result.recommendations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 p-8">
      {/* Header */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        AI Recommendations 🤖
      </motion.h1>

      {loading && <p className="text-gray-500 text-center mb-4">Fetching personalized recommendations...</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Workout */}
          <Card>
            <h2 className="text-xl font-semibold mb-2 text-blue-700">🏋️ Workout Suggestion</h2>
            <p className="text-gray-700 mb-3">{data.suggestedWorkout}</p>
            {data.weeklyWorkouts && (
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={data.weeklyWorkouts}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="duration" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Calories */}
          <Card>
            <h2 className="text-xl font-semibold mb-2 text-green-700">🍽 Recommended Calories</h2>
            <p className="text-gray-700 mb-3">{data.recommendedCalories} kcal/day</p>
            {data.weeklyCalories && (
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={data.weeklyCalories}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calories" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Diet */}
          <Card>
            <h2 className="text-xl font-semibold mb-2 text-orange-700">🥗 Diet Tip</h2>
            <p className="text-gray-700">{data.dietTip}</p>
          </Card>

          {/* Sleep */}
          <Card>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">💤 Sleep Advice</h2>
            <p className="text-gray-700 mb-3">{data.sleepAdvice}</p>
            {data.weeklySleep && (
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={data.weeklySleep}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            <p className="text-xs text-gray-400 mt-3 text-right">
              Updated on {dayjs().format('MMM D, YYYY h:mm A')}
            </p>
          </Card>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-8 flex justify-center">
        <Button onClick={fetchRecommendations} disabled={loading}>
          🔄 Refresh Recommendations
        </Button>
      </div>
    </div>
  );
}
