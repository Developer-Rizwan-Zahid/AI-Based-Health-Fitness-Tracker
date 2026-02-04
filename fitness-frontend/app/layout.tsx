import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';
import { User, UserCircle2 } from 'lucide-react';

export const metadata = {
  title: 'AI Health & Fitness Tracker',
  description: 'Smart fitness platform with AI recommendations',
};

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen font-sans">
        
        {/* Navbar */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-extrabold text-blue-600">
              AI Fitness Tracker
            </Link>
            <nav className="flex space-x-6 text-gray-700 font-medium">
               <Link href="/admin" className="hover:text-blue-600">Admin</Link>
              <Link href="/reports" className="hover:text-blue-600">Reports</Link>

              <Link 
                href="/dashboard" 
                className="hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
