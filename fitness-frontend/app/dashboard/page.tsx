'use client';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import { getHubConnection, startHub } from '../lib/signalr';
import dayjs from 'dayjs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LogOut, UserCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [sleeps, setSleeps] = useState<any[]>([]);
  const router = useRouter();

  const fetchAll = async (uid: number) => {
    try {
      const [m, w, s] = await Promise.all([
        api.get(`/meal/${uid}`),
        api.get(`/workout/${uid}`),
        api.get(`/sleep/${uid}`),
      ]);
      setMeals(m.data);
      setWorkouts(w.data);
      setSleeps(s.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) return;

    const parsed = JSON.parse(u);
    setUser(parsed);
    fetchAll(parsed.id);

    const hubConnection = getHubConnection();
    hubConnection.on('ReceiveUpdate', (uid, type) => {
      if (uid === parsed.id) fetchAll(uid);
    });

    startHub();

    return () => {
      hubConnection.off('ReceiveUpdate');
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user)
    return (
      <p className="text-center mt-20 text-gray-600 animate-pulse">
        Please login first.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100">
      {/*NAVBAR */}
      <motion.nav
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/*Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <h1 className="text-xl font-bold text-blue-700 tracking-tight">
              FitTrack<span className="text-gray-700">AI</span>
            </h1>
          </div>

          {/*Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/meals"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
            >
              Meals
            </Link>
            <Link
              href="/workouts"
              className="text-gray-700 font-medium hover:text-green-600 transition-colors duration-200"
            >
              Workouts
            </Link>
            <Link
              href="/sleep"
              className="text-gray-700 font-medium hover:text-yellow-600 transition-colors duration-200"
            >
              Sleep
            </Link>
            <Link href="/ai" className="text-gray-700 hover:text-blue-600">
              AI Recommendations
            </Link>

          </div>

          {/*User Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <UserCircle2 className="w-6 h-6 text-blue-500" />
              <Link href="/profile" className="font-medium hidden sm:inline">{user.name}</Link>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-sm transition-all shadow"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden border-t border-gray-100 bg-white/80 backdrop-blur-lg flex justify-center gap-6 py-3">
          <Link
            href="/meals"
            className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
          >
            Meals
          </Link>
          <Link
            href="/workouts"
            className="text-gray-700 font-medium hover:text-green-600 transition-colors"
          >
            Workouts
          </Link>
          <Link
            href="/sleep"
            className="text-gray-700 font-medium hover:text-yellow-600 transition-colors"
          >
            Sleep
          </Link>
        </div>
      </motion.nav>

      {/* HEADER SECTION */}
      <motion.div
        className="max-w-6xl mx-auto text-center mt-12 mb-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-3">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 text-lg">
          Here’s your AI-powered health performance summary.
        </p>
      </motion.div>

      {/*DASHBOARD CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-16">
        {/* Meals */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 transition-all"
        >
          <h2 className="font-semibold text-xl mb-2 text-blue-600 flex items-center justify-between">
            Meals
            <span className="text-sm text-gray-500 font-normal">
              {meals.length} logged
            </span>
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            Your calorie trends this week
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={meals.slice(-7).map((m) => ({
                name: dayjs(m.date).format('DD MMM'),
                calories: m.calories,
              }))}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" radius={[8, 8, 0, 0]} fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Workouts */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 transition-all"
        >
          <h2 className="font-semibold text-xl mb-2 text-green-600 flex items-center justify-between">
            Workouts
            <span className="text-sm text-gray-500 font-normal">
              {workouts.length} logged
            </span>
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            Exercise duration over last 7 days
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={workouts.slice(-7).map((w) => ({
                name: dayjs(w.date).format('DD MMM'),
                duration: w.durationMinutes,
              }))}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="duration" radius={[8, 8, 0, 0]} fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sleep */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 transition-all"
        >
          <h2 className="font-semibold text-xl mb-2 text-yellow-600 flex items-center justify-between">
            Sleep
            <span className="text-sm text-gray-500 font-normal">
              {sleeps.length} records
            </span>
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            Your sleep hours this week
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={sleeps.slice(-7).map((s) => ({
                name: dayjs(s.sleepStart).format('DD MMM'),
                hours: s.durationHours,
              }))}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" radius={[8, 8, 0, 0]} fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/*FOOTER*/}
      <motion.footer
        className="text-center py-6 text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        © {new Date().getFullYear()} FitTrackAI — All Rights Reserved
      </motion.footer>
    </div>
  );
}
