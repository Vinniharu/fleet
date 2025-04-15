"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataDashboard from "@/app/components/data-engineer/DataDashboard";
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';

const CreateFlightLogPage = () => {
    const router = useRouter();
    
    return (
        <ProtectedRoute allowedRoles={['Pilot', 'Admin']}>
            <DataDashboard>
                <div className="container mx-auto px-4 py-8 text-gray-200">
                    <h1 className="text-3xl font-bold mb-6 text-yellow-400">Create Flight Log</h1>
                    
                    {/* Form content */}
                    <div className="bg-gray-900/70 p-6 rounded-xl border border-yellow-500/20 shadow-lg">
                        <p className="text-lg text-center mb-6">Flight log form implementation goes here</p>
                        
                        <div className="flex justify-end mt-6 space-x-4">
                            <button
                                onClick={() => router.push('/data-collection/view-flight-logs')}
                                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-colors"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </DataDashboard>
        </ProtectedRoute>
    );
};

export default CreateFlightLogPage;
