"use client";

import ProtectedRoute from "@/app/components/auth/ProtectedRoute";

export default function PilotLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["Pilot"]}>
      {children}
    </ProtectedRoute>
  );
} 