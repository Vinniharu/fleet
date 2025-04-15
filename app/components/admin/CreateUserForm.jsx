"use client";

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useNotification } from '@/app/context/NotificationContext';

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Pilot' // Default role
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { createUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await createUser(formData);
      
      // Set success state
      const successMessage = 'User created successfully!';
      setSuccess(successMessage);
      
      // Show success toast notification
      showSuccess(successMessage);
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'Pilot'
      });
    } catch (err) {
      const errorMessage = err.message || 'Failed to create user';
      setError(errorMessage);
      
      // Show error toast notification
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/70 p-6 rounded-xl border border-yellow-500/20 shadow-lg max-w-md m-auto">
      <h2 className="text-xl font-semibold mb-4 text-yellow-400">Create New User</h2>
      
      {error && (
        <div className="bg-red-900/30 backdrop-blur-sm border-l-4 border-red-500 text-red-300 px-4 py-3 rounded-md text-sm mb-6 shadow-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/30 backdrop-blur-sm border-l-4 border-green-500 text-green-300 px-4 py-3 rounded-md text-sm mb-6 shadow-sm">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="e.g. admin2"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="e.g. admin2@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="••••••••"
          />
          <p className="text-xs text-gray-400 mt-1">
            Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.
          </p>
        </div>
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="Admin">Admin</option>
            <option value="Pilot">Pilot</option>
            <option value="Data Engineer">Data Engineer</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}
