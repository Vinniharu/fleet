"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useNotification } from '@/app/context/NotificationContext';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import Link from 'next/link';
import AdminDashboard from '@/app/components/admin/AdminDashboard';

export default function Dashboard() {
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { showError } = useNotification();

  useEffect(() => {
    // Display error in notification if it exists
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const handleErrorDismiss = () => {
    setError('');
  };

  const content = (
    <div className="container mx-auto px-2 sm:px-4 py-4 pt-10 sm:py-8 text-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">Admin Dashboard</h1>
        {user && (
          <div className="flex items-center space-x-3">
            <span className="text-sm sm:text-base text-gray-300">Welcome, <span className="font-semibold text-yellow-400">{user.name || user.email}</span></span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
              {user.role}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-900/30 backdrop-blur-sm border-l-4 border-red-500 text-red-300 px-4 py-3 rounded-md text-sm mb-6 shadow-sm flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={handleErrorDismiss}
            className="text-red-300 hover:text-red-100"
            aria-label="Dismiss error"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Admin Quick Links */}
        <div className="lg:col-span-3 bg-gray-900/70 p-4 sm:p-6 rounded-xl border border-yellow-500/20 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Admin Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <Link href="/admin/manage-users" className="bg-gray-800 hover:bg-gray-700 p-3 sm:p-4 rounded-lg border border-gray-700 transition-colors group">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-yellow-500/20 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-sm sm:text-base">User Management</h3>
                <p className="text-xs text-gray-400 mt-1">Create and manage users</p>
              </div>
            </Link>
            
            <Link href="/data-collection/view-flight-logs" className="bg-gray-800 hover:bg-gray-700 p-3 sm:p-4 rounded-lg border border-gray-700 transition-colors group">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-yellow-500/20 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-medium text-sm sm:text-base">Flight Logs</h3>
                <p className="text-xs text-gray-400 mt-1">View and manage flight data</p>
              </div>
            </Link>
            
            <div className="bg-gray-800 hover:bg-gray-700 p-3 sm:p-4 rounded-lg border border-gray-700 transition-colors group cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-yellow-500/20 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-sm sm:text-base">System Settings</h3>
                <p className="text-xs text-gray-400 mt-1">Configure system parameters</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* System Status */}
        <div className="bg-gray-900/70 p-4 sm:p-6 rounded-xl border border-yellow-500/20 shadow-lg">
          <h2 className="text-xl font-semibold mb-3 sm:mb-4 text-yellow-400">System Status</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-300">API Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                <span className="h-2 w-2 rounded-full bg-green-400 mr-1.5"></span>
                Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-300">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                <span className="h-2 w-2 rounded-full bg-green-400 mr-1.5"></span>
                Healthy
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-300">Storage</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                <span className="h-2 w-2 rounded-full bg-green-400 mr-1.5"></span>
                68% Free
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-300">Memory Usage</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                <span className="h-2 w-2 rounded-full bg-yellow-400 mr-1.5"></span>
                75%
              </span>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-gray-900/70 p-4 sm:p-6 rounded-xl border border-yellow-500/20 shadow-lg">
          <h2 className="text-xl font-semibold mb-3 sm:mb-4 text-yellow-400">Recent Activity</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="border-l-2 border-yellow-500 pl-3 py-1">
              <p className="text-xs sm:text-sm">User <span className="text-yellow-400">pilot1</span> logged in</p>
              <p className="text-xs text-gray-400">2 hours ago</p>
            </div>
            <div className="border-l-2 border-yellow-500 pl-3 py-1">
              <p className="text-xs sm:text-sm">New flight log submitted by <span className="text-yellow-400">Alex Johnson</span></p>
              <p className="text-xs text-gray-400">5 hours ago</p>
            </div>
            <div className="border-l-2 border-yellow-500 pl-3 py-1">
              <p className="text-xs sm:text-sm">User <span className="text-yellow-400">dataeng1</span> created</p>
              <p className="text-xs text-gray-400">1 day ago</p>
            </div>
            <div className="border-l-2 border-yellow-500 pl-3 py-1">
              <p className="text-xs sm:text-sm">System backup completed</p>
              <p className="text-xs text-gray-400">1 day ago</p>
            </div>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="bg-gray-900/70 p-4 sm:p-6 rounded-xl border border-yellow-500/20 shadow-lg">
          <h2 className="text-xl font-semibold mb-3 sm:mb-4 text-yellow-400">Stats Summary</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
              <p className="text-xs text-gray-400">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-400">8</p>
            </div>
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
              <p className="text-xs text-gray-400">Active Drones</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-400">4</p>
            </div>
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
              <p className="text-xs text-gray-400">Flights Today</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-400">3</p>
            </div>
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
              <p className="text-xs text-gray-400">Total Flight Time</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-400">42h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles="Admin">
      <AdminDashboard>{content}</AdminDashboard>
    </ProtectedRoute>
  );
} 