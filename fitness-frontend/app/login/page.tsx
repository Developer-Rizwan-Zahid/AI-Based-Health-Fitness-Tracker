'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.post('/auth/login', form);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setSuccessMsg(`Welcome back, ${user.name}!`);
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-botom from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
          Login to Your Account
        </h1>

        {/* Messages */}
        {errorMsg && (
          <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-md border border-red-200">
            {errorMsg}
          </p>
        )}
        {successMsg && (
          <p className="text-green-600 text-sm mb-3 bg-green-50 p-2 rounded-md border border-green-200">
            {successMsg}
          </p>
        )}
        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-600">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full mt-4 py-3 rounded-xl font-semibold text-white transition-all ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{' '}
            <span
              onClick={() => router.push('/register')}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
