"use client";

import { useNotification } from '@/app/context/NotificationContext';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const FlightLogForm = () => {
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    flightTimestamp: '',
    missionCoordinator: '',
    aircraftName: '',
    altitudeM: '',
    windSpeedMps: '',
    flightDistanceKm: '',
    batteryTakeoff3sV: '',
    batteryTakeoff7sV: '',
    batteryTakeoff14sV: '',
    batteryLanding3sV: '',
    batteryLanding7sV: '',
    batteryLanding14sV: '',
    battery3sQty: 0,
    battery7sQty: 0,
    battery14sQty: 0,
    batteryHealth: 'Good',
    systemHealthStatus: 'Normal',
    weatherConditions: '',
    windConditions: '',
    temperatureC: '',
    flightYear: new Date().getFullYear(),
    flightMonth: new Date().getMonth() + 1,
    flightWeek: Math.ceil(new Date().getDate() / 7),
    flightTimeMinutes: '',
    missionObjective: '',
    description: '',
    status: 'Pending',
    comment: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const router = useRouter();

  const validateForm = () => {
    const requiredFields = [
      'flightTimestamp',
      'missionCoordinator',
      'aircraftName',
      'altitudeM',
      'windSpeedMps',
      'flightDistanceKm',
      'weatherConditions',
      'windConditions',
      'temperatureC',
      'flightTimeMinutes',
      'missionObjective',
      'description'
    ];

    const emptyFields = requiredFields.filter(field => !formData[field]);

    if (emptyFields.length > 0) {
      showError(`Please fill in all required fields: ${emptyFields.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a copy of the data with numeric conversions
      const processedData = { ...formData };
      const numericFields = [
        'altitudeM', 'windSpeedMps', 'flightDistanceKm', 
        'batteryTakeoff3sV', 'batteryTakeoff7sV', 'batteryTakeoff14sV',
        'batteryLanding3sV', 'batteryLanding7sV', 'batteryLanding14sV',
        'battery3sQty', 'battery7sQty', 'battery14sQty',
        'temperatureC', 'flightTimeMinutes',
        'flightYear', 'flightMonth', 'flightWeek'
      ];
      
      numericFields.forEach(field => {
        if (processedData[field] !== '') {
          processedData[field] = parseFloat(processedData[field]);
        }
      });
      
      const response = await fetch(`https://www.briechuas.com/flmgt/flight-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(sessionStorage.getItem('accessToken'))}`
        },
        body: JSON.stringify(processedData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      await response.json();
      showSuccess('Flight log submitted successfully!');
      router.push('/data-engineer/view-flight-logs');
    } catch (error) {
      console.error('Error submitting flight log:', error);
      showError(`Failed to submit: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 bg-transparent rounded-lg shadow-md">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Flight Log Form</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Flight Basic Information */}
          <div className="col-span-1 sm:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Flight Information</h2>
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Flight Timestamp</label>
            <input
              type="datetime-local"
              name="flightTimestamp"
              value={formData.flightTimestamp}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Mission Coordinator</label>
            <input
              type="text"
              name="missionCoordinator"
              value={formData.missionCoordinator}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="Full name"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Aircraft Name</label>
            <input
              type="text"
              name="aircraftName"
              value={formData.aircraftName}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. Damisa-001"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Flight Time (minutes)</label>
            <input
              type="number"
              step="0.1"
              name="flightTimeMinutes"
              value={formData.flightTimeMinutes}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 25"
            />
          </div>
          
          {/* Flight Parameters */}
          <div className="col-span-1 sm:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Flight Parameters</h2>
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Altitude (meters)</label>
            <input
              type="number"
              step="0.1"
              name="altitudeM"
              value={formData.altitudeM}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 120.5"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Flight Distance (km)</label>
            <input
              type="number"
              step="0.1"
              name="flightDistanceKm"
              value={formData.flightDistanceKm}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 15.3"
            />
          </div>
          
          {/* Weather Information */}
          <div className="col-span-1 sm:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Weather Conditions</h2>
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Weather</label>
            <select
              name="weatherConditions"
              value={formData.weatherConditions}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-900 text-sm sm:text-base"
            >
              <option value="">Select Weather</option>
              <option value="Clear">Clear</option>
              <option value="Partly Cloudy">Partly Cloudy</option>
              <option value="Cloudy">Cloudy</option>
              <option value="Rainy">Rainy</option>
              <option value="Foggy">Foggy</option>
              <option value="Snowy">Snowy</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Wind Conditions</label>
            <select
              name="windConditions"
              value={formData.windConditions}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-900 text-sm sm:text-base"
            >
              <option value="">Select Wind Condition</option>
              <option value="Calm">Calm</option>
              <option value="Light Breeze">Light Breeze</option>
              <option value="Moderate Breeze">Moderate Breeze</option>
              <option value="Strong Breeze">Strong Breeze</option>
              <option value="High Wind">High Wind</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Wind Speed (m/s)</label>
            <input
              type="number"
              step="0.1"
              name="windSpeedMps"
              value={formData.windSpeedMps}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 5.2"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Temperature (°C)</label>
            <input
              type="number"
              step="0.1"
              name="temperatureC"
              value={formData.temperatureC}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 22.5"
            />
          </div>
          
          {/* Battery Information */}
          <div className="col-span-1 sm:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Battery Information</h2>
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">3S Battery Quantity</label>
            <input
              type="number"
              name="battery3sQty"
              value={formData.battery3sQty}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 2"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">7S Battery Quantity</label>
            <input
              type="number"
              name="battery7sQty"
              value={formData.battery7sQty}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 1"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">14S Battery Quantity</label>
            <input
              type="number"
              name="battery14sQty"
              value={formData.battery14sQty}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 1"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Battery Health</label>
            <select
              name="batteryHealth"
              value={formData.batteryHealth}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-900 text-sm sm:text-base"
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Takeoff Battery Voltage (3S)</label>
            <input
              type="number"
              step="0.1"
              name="batteryTakeoff3sV"
              value={formData.batteryTakeoff3sV}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 12.5"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Takeoff Battery Voltage (7S)</label>
            <input
              type="number"
              step="0.1"
              name="batteryTakeoff7sV"
              value={formData.batteryTakeoff7sV}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 29.1"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Takeoff Battery Voltage (14S)</label>
            <input
              type="number"
              step="0.1"
              name="batteryTakeoff14sV"
              value={formData.batteryTakeoff14sV}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 58.0"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Landing Battery Voltage (3S)</label>
            <input
              type="number"
              step="0.1"
              name="batteryLanding3sV"
              value={formData.batteryLanding3sV}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 11.8"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Landing Battery Voltage (7S)</label>
            <input
              type="number"
              step="0.1"
              name="batteryLanding7sV"
              value={formData.batteryLanding7sV}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 27.5"
            />
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Landing Battery Voltage (14S)</label>
            <input
              type="number"
              step="0.1"
              name="batteryLanding14sV"
              value={formData.batteryLanding14sV}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. 55.2"
            />
          </div>
          
          {/* Mission Information */}
          <div className="col-span-1 sm:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Mission Information</h2>
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">System Health Status</label>
            <select
              name="systemHealthStatus"
              value={formData.systemHealthStatus}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-900 text-sm sm:text-base"
            >
              <option value="Normal">Normal</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
              <option value="Failure">Failure</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Flight Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-900 text-sm sm:text-base"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Aborted">Aborted</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          
          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Mission Objective</label>
            <input
              type="text"
              name="missionObjective"
              value={formData.missionObjective}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="e.g. Infrastructure Inspection - Power Lines Sector 4B"
            />
          </div>
          
          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="Detailed description of the mission"
            ></textarea>
          </div>
          
          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">Comments</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 border rounded text-sm sm:text-base"
              placeholder="Any additional comments about the flight"
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-end mt-4 sm:mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 text-sm sm:text-base"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Flight Log'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlightLogForm;
