'use client';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import dayjs from 'dayjs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function ReportsPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  const [sleeps, setSleeps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) return;
    setUserId(JSON.parse(user).id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [w, m, s] = await Promise.all([
          api.get(`/workout/${userId}`),
          api.get(`/meal/${userId}`),
          api.get(`/sleep/${userId}`),
        ]);
        setWorkouts(w.data);
        setMeals(m.data);
        setSleeps(s.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleSendReport = async () => {
    if (!userId) return;
    setSending(true);
    setMessage('');
    try {
      const res = await api.post(`/report/send/${userId}`, {});
      setMessage(res.data?.message || 'Weekly report sent!');
    } catch (err: any) {
      setMessage(`Failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-white to-gray-100">
      <motion.h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Weekly Health Reports 📊
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ReportCard title="Workouts" color="blue" data={workouts} dataKey="durationMinutes" />
        <ReportCard title="Meals" color="green" data={meals} dataKey="calories" />
        <ReportCard title="Sleep" color="yellow" data={sleeps} dataKey="durationHours" />
      </div>

      <div className="text-center">
        <button
          disabled={sending}
          onClick={handleSendReport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Send Weekly Report'}
        </button>
        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
}

function ReportCard({ title, color, data, dataKey }: any) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100`}>
      <h2 className={`text-xl font-semibold mb-2 text-${color}-600`}>{title}</h2>
      <p className="text-gray-500 mb-4">Records this week: {data.length}</p>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data.slice(-7).map((d: any) => ({
          day: dayjs(d.date || d.sleepStart).format('DD MMM'),
          value: d[dataKey]
        }))}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={`#${color === 'blue' ? '3B82F6' : color === 'green' ? '10B981' : 'F59E0B'}`} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
