'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, BookOpen, LogOut, UserCircle } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  semester: number;
  branch: string;
}

export default function DashboardClient({ student }: { student: Student }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Clear ALL possible storage
      try {
        sessionStorage.clear();
      } catch (e) {
        console.log('SessionStorage clear failed:', e);
      }
      
      try {
        localStorage.clear();
      } catch (e) {
        console.log('LocalStorage clear failed:', e);
      }
      
      // Clear cookies manually (belt and suspenders approach)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Hard redirect to login (forces complete page reload)
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout API fails
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-6 border-b-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {student.name}!</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <button
                      className="w-full py-3 px-4 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3 text-left"
                    >
                      <UserCircle className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">View Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        router.push('/feedback');
                      }}
                      className="w-full py-3 px-4 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3 text-left bg-blue-50 border-2 border-blue-300 my-2"
                    >
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-bold text-blue-600">Feedback Section</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 px-4 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-3 text-left"
                    >
                      <LogOut className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-600">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Student Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-100">
              <p className="text-sm text-blue-600 font-medium mb-2">Student Name</p>
              <p className="text-2xl font-bold text-gray-800">{student.name}</p>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-green-50 to-green-100">
              <p className="text-sm text-green-600 font-medium mb-2">Roll Number</p>
              <p className="text-2xl font-bold text-gray-800">{student.rollNo}</p>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-purple-100">
              <p className="text-sm text-purple-600 font-medium mb-2">Semester</p>
              <p className="text-2xl font-bold text-gray-800">{student.semester}th Semester</p>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-orange-50 to-orange-100">
              <p className="text-sm text-orange-600 font-medium mb-2">Branch</p>
              <p className="text-2xl font-bold text-gray-800">{student.branch}</p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-indigo-50 to-indigo-100">
            <p className="text-sm text-indigo-600 font-medium mb-2">Email Address</p>
            <p className="text-xl font-bold text-gray-800">{student.email}</p>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-300 rounded-xl">
            <div className="flex items-start gap-3">
              <BookOpen className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-blue-800 text-lg mb-2">
                  📋 Submit Your Course Feedback
                </h3>
                <p className="text-blue-700">
                  Click the <strong>menu icon (⋮)</strong> in the top right corner and select{' '}
                  <strong>"Feedback Section"</strong> to view your courses and submit feedback for this semester.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}