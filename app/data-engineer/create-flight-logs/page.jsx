"use client";
import React from "react";
import DataDashboard from "@/app/components/data-engineer/DataDashboard";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import FlightLogForm from "@/app/components/data-engineer/FlightLogForm";
const CreateFlightLogPage = () => {
  return (
    <ProtectedRoute allowedRoles={["Data Engineer"]}>
      <DataDashboard>
        <div className="container mx-auto px-4 py-8 text-gray-200">
          <h1 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
            Create Flight Log
          </h1>

          {/* Form content */}
          <div className="bg-gray-900/70 overflow-hidden rounded-xl border border-yellow-500/20 shadow-lg">
            <FlightLogForm />
          </div>
        </div>
      </DataDashboard>
    </ProtectedRoute>
  );
};

export default CreateFlightLogPage;
