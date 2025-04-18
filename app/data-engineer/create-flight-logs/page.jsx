"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DataDashboard from "@/app/components/data-engineer/DataDashboard";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import FlightLogForm from "@/app/components/data-engineer/FlightLogForm";
import { useNotification } from "@/app/context/NotificationContext";
import authService from "@/lib/authService";

const CreateFlightLogPage = () => {
  const {showSuccess, showError} = useNotification();
  const router = useRouter();

  const handleSubmit = async (formData) => {
    authService.refreshToken();
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/flight-logs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
          body: JSON.stringify(formData),
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit flight log');
      }

      showSuccess("Flight log created successfully");
      router.push("/data-engineer/view-flight-logs");

    } catch (error) {
      console.error("Error submitting flight log:", error);
      showError("Failed to submit flight log");
      throw error; // Re-throw to let parent components handle the error if needed
    }
  };

  return (
    <ProtectedRoute allowedRoles={["Data Engineer"]}>
      <DataDashboard>
        <div className="container mx-auto px-4 py-8 text-gray-200">
          <h1 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
            Create Flight Log
          </h1>

          {/* Form content */}
          <div className="bg-gray-900/70 overflow-hidden rounded-xl border border-yellow-500/20 shadow-lg">
            <FlightLogForm onSubmit={handleSubmit} />
          </div>
        </div>
      </DataDashboard>
    </ProtectedRoute>
  );
};

export default CreateFlightLogPage;
