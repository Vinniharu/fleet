"use client";

import React from 'react';

export default function InfoPanel({ flight }) {
  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="text-lg font-medium text-yellow-500 border-b border-yellow-500/30 pb-2 mb-4">Flight Information</h3>
      
      <div className="space-y-6 text-sm flex-grow overflow-auto">
        <div>
          <div className="text-gray-400 mb-1">Mission Coordinator</div>
          <div className="font-medium">{flight.missionCoordinator}</div>
        </div>
        
        <div>
          <div className="text-gray-400 mb-1">Aircraft</div>
          <div className="font-medium">{flight.aircraftName}</div>
        </div>
        
        <div>
          <div className="text-gray-400 mb-1">Mission Objective</div>
          <div className="font-medium">{flight.missionObjective}</div>
        </div>
        
        <div>
          <div className="text-gray-400 mb-1">Flight Date & Time</div>
          <div className="font-medium">{formatDate(flight.flightTimestamp)}</div>
        </div>
        
        <div>
          <div className="text-gray-400 mb-1">Log Created</div>
          <div className="font-medium">{formatDate(flight.logTimestamp)}</div>
        </div>
        
        <div>
          <div className="text-gray-400 mb-1">Weather Conditions</div>
          <div className="font-medium">{flight.weatherConditions}</div>
        </div>
        
        <div>
          <div className="text-gray-400 mb-1">Wind Conditions</div>
          <div className="font-medium">{flight.windConditions}</div>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg mt-4 border border-yellow-500/10">
          <div className="text-gray-400 mb-1">Description</div>
          <div className="font-medium">{flight.description}</div>
        </div>
        
        {flight.comment && (
          <div className="bg-gray-700/50 p-3 rounded-lg mt-4 border border-yellow-500/10">
            <div className="text-gray-400 mb-1">Comments</div>
            <div className="font-medium">{flight.comment}</div>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-yellow-500/30 text-center">
        <div className="text-gray-400 text-xs mb-1">Flight ID: {flight.id}</div>
        <div className="text-gray-400 text-xs">Week {flight.flightWeek}, {flight.flightYear}</div>
      </div>
    </div>
  );
} 