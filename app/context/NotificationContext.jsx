"use client";

import { createContext, useContext, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Create Notification Context
const NotificationContext = createContext();

// Notification Provider Component
export function NotificationProvider({ children }) {
  // Show success notification
  const showSuccess = (message, options = {}) => {
    return toast.success(message, {
      style: {
        background: '#1f2937',
        color: '#d1fae5',
        border: '1px solid #065f46',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#1f2937',
      },
      duration: 5000,
      ...options
    });
  };

  // Show error notification
  const showError = (message, options = {}) => {
    return toast.error(message, {
      style: {
        background: '#1f2937',
        color: '#fee2e2',
        border: '1px solid #b91c1c',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#1f2937',
      },
      duration: 5000,
      ...options
    });
  };

  // Show info notification
  const showInfo = (message, options = {}) => {
    return toast(message, {
      style: {
        background: '#1f2937',
        color: '#e0f2fe',
        border: '1px solid #0369a1',
      },
      iconTheme: {
        primary: '#0ea5e9',
        secondary: '#1f2937',
      },
      duration: 4000,
      ...options
    });
  };

  // Show warning notification
  const showWarning = (message, options = {}) => {
    return toast(message, {
      icon: '⚠️',
      style: {
        background: '#1f2937',
        color: '#fef3c7',
        border: '1px solid #d97706',
      },
      duration: 5000,
      ...options
    });
  };

  // Dismiss all notifications
  const dismissAll = () => {
    toast.dismiss();
  };

  // Create a notification based on type
  const notify = (type, message, options = {}) => {
    switch (type) {
      case 'success':
        return showSuccess(message, options);
      case 'error':
        return showError(message, options);
      case 'info':
        return showInfo(message, options);
      case 'warning':
        return showWarning(message, options);
      default:
        return showInfo(message, options);
    }
  };

  // Notification context value
  const value = {
    notify,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    dismissAll
  };

  return (
    <NotificationContext.Provider value={value}>
      <Toaster 
        position="top-right"
        toastOptions={{
          // Common toast options
          className: '',
          duration: 2000,
        }}
      />
      {children}
    </NotificationContext.Provider>
  );
}

// Hook for using the notification context
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
} 