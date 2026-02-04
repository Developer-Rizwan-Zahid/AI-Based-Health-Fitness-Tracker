'use client';
import Link from 'next/link';
import RunningAnimation from './components/RunningAnimation';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col justify-start items-center">

      {/* Hero Section */}
      <section className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-6 md:px-16 mt-16 md:mt-24 gap-12 relative">
        {/* Background shapes */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-100 rounded-full opacity-50 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-100 rounded-full opacity-50 blur-3xl animate-pulse"></div>

        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left space-y-6 z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 leading-tight">
            AI Health & Fitness Tracker
          </h1>
          <p className="text-gray-700 text-lg md:text-xl">
            Track meals, workouts, and sleep. Get AI-powered insights to reach your health goals faster.
          </p>
          <div className="flex flex-col md:flex-row justify-center md:justify-start gap-4 mt-6">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-gray-200 text-gray-800 font-semibold rounded-xl shadow hover:bg-gray-300 transition transform hover:-translate-y-1"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right: Lottie */}
        <div className="flex-1 flex justify-center md:justify-end z-10">
          <div className="w-80 md:w-96 bg-white rounded-3xl shadow-2xl p-4 flex items-center justify-center">
            <RunningAnimation />
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="mt-24 max-w-6xl w-full px-6 md:px-16 grid md:grid-cols-3 gap-10 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2">
          <Link
            href="/workouts"
            className="text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors mb-2 block"
          >
            Workouts
          </Link>
          <p className="text-gray-600 text-sm md:text-base mt-2">
            Log exercises, track duration & calories burned, and stay motivated every day.
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2">
          <Link
            href="/meals"
            className="text-xl md:text-2xl font-bold text-green-600 hover:text-green-700 transition-colors mb-2 block"
          >
            Meals
          </Link>
          <p className="text-gray-600 text-sm md:text-base mt-2">
            Keep track of your meals and calories to maintain a healthy diet effortlessly.
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2">
          <Link
            href="/sleep"
            className="text-xl md:text-2xl font-bold text-yellow-500 hover:text-yellow-600 transition-colors mb-2 block"
          >
            Sleep
          </Link>
          <p className="text-gray-600 text-sm md:text-base mt-2">
            Monitor your sleep patterns to optimize recovery and energy throughout the day.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 mb-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} AI Health & Fitness Tracker. All rights reserved.
      </footer>
    </div>
  );
}
