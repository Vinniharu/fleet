"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

/**
 * Protected Route Component
 * Restricts access based on authentication and roles
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render when access is granted
 * @param {string|string[]} [props.allowedRoles] - Roles allowed to access the route
 * @param {string} [props.redirectTo="/login"] - Where to redirect if access is denied
 * @returns {React.ReactNode|null}
 */
export default function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/login' 
}) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const authCheckPerformed = useRef(false);

  useEffect(() => {
    // Skip effect if we're still loading
    if (loading) return;
    
    // Skip if we've already performed the check in this render cycle
    if (authCheckPerformed.current) return;
    
    // Mark that we've performed the check
    authCheckPerformed.current = true;
    
    // Check authorization
    const checkAuth = async () => {
      // If no user, redirect to login
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // If roles are required, check them
      if (allowedRoles) {
        const hasRequiredRole = hasRole(allowedRoles);
        if (!hasRequiredRole) {
          // Redirect to appropriate page
          router.push('/login');
          return;
        }
      }

      // User is authorized if we reach here
      setAuthorized(true);
    };
    
    // Run the authorization check
    checkAuth();
    
    // Reset the check when the dependencies change
    return () => {
      authCheckPerformed.current = false;
    };
  }, [user, loading, allowedRoles, hasRole, redirectTo, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <p className="text-yellow-500">Loading...</p>
        </div>
      </div>
    );
  }

  return authorized ? children : null;
}