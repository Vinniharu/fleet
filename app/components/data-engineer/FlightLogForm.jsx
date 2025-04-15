"use client";
import React, { useState } from 'react';

const FlightLogForm = ({ onSubmit, initialData = {} }) => {
  // Form sections
  const SECTIONS = ['Basic Information', 'Weather & Environment', 'Technical Data'];
  
  // State
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    timestamp: initialData.timestamp || '',
    missionCoordinator: initialData.missionCoordinator || '',
    nameOfAircraft: initialData.nameOfAircraft || '',
    altitudeM: initialData.altitudeM || '',
    windSpeedMS: initialData.windSpeedMS || '',
    flightDistanceKm: initialData.flightDistanceKm || '',
    batteryTakeoffVoltage3s: initialData.batteryTakeoffVoltage3s || '',
    batteryTakeoffVoltage7s: initialData.batteryTakeoffVoltage7s || '',
    batteryTakeoffVoltage14s: initialData.batteryTakeoffVoltage14s || '',
    batteryLandingVoltage3s: initialData.batteryLandingVoltage3s || '',
    batteryLandingVoltage7s: initialData.batteryLandingVoltage7s || '', 
    batteryLandingVoltage14s: initialData.batteryLandingVoltage14s || '',
    battery3sQty: initialData.battery3sQty || 0,
    battery7sQty: initialData.battery7sQty || 0,
    battery14sQty: initialData.battery14sQty || 0,
    batteryHealth: initialData.batteryHealth || '',
    droneOverallSystemHealthStatus: initialData.droneOverallSystemHealthStatus || '',
    weatherConditions: initialData.weatherConditions || '',
    windConditions: initialData.windConditions || '',
    temperatureC: initialData.temperatureC || '',
    year: initialData.year || new Date().getFullYear(),
    month: initialData.month || '',
    week: initialData.week || '',
    flightTime: initialData.flightTime || '',
    missionObjective: initialData.missionObjective || '',
    description: initialData.description || '',
    fuelLevelL: initialData.fuelLevelL || '',
    weightKgBefore: initialData.weightKg?.before || '',
    weightKgAfter: initialData.weightKg?.after || '',
    fuelConsumptionL: initialData.fuelConsumptionL || '',
    status: initialData.status || 'Pending',
    comment: initialData.comment || '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Navigate between sections
  const nextSection = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      handleSubmit();
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Prepare the proper weight object structure
    const formattedData = {
      ...formData,
      weightKg: {
        before: parseFloat(formData.weightKgBefore),
        after: parseFloat(formData.weightKgAfter)
      }
    };
    
    // Remove the separate weight properties
    delete formattedData.weightKgBefore;
    delete formattedData.weightKgAfter;
    
    onSubmit(formattedData);
  };

  // Render form section
  const renderFormSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="bg-gray-800 rounded-lg shadow-md p-6 text-gray-200">
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b-2 border-yellow-500 inline-block">Basic Flight Information</h3>
            
            <div className="mb-4">
              <label htmlFor="timestamp" className="block text-gray-300 font-medium mb-2">Timestamp</label>
              <input
                type="datetime-local"
                id="timestamp"
                name="timestamp"
                value={formData.timestamp ? formData.timestamp.slice(0, 16) : ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="missionCoordinator" className="block text-gray-300 font-medium mb-2">Mission Coordinator</label>
              <input
                type="text"
                id="missionCoordinator"
                name="missionCoordinator"
                value={formData.missionCoordinator}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="nameOfAircraft" className="block text-gray-300 font-medium mb-2">Aircraft Name</label>
              <input
                type="text"
                id="nameOfAircraft"
                name="nameOfAircraft"
                value={formData.nameOfAircraft}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="year" className="block text-gray-300 font-medium mb-2">Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                />
              </div>
              
              <div>
                <label htmlFor="month" className="block text-gray-300 font-medium mb-2">Month</label>
                <input
                  type="text"
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                />
              </div>
              
              <div>
                <label htmlFor="week" className="block text-gray-300 font-medium mb-2">Week</label>
                <input
                  type="number"
                  id="week"
                  name="week"
                  value={formData.week}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="flightTime" className="block text-gray-300 font-medium mb-2">Flight Time (HH:MM:SS)</label>
              <input
                type="text"
                id="flightTime"
                name="flightTime"
                value={formData.flightTime}
                onChange={handleChange}
                placeholder="00:00:00"
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="missionObjective" className="block text-gray-300 font-medium mb-2">Mission Objective</label>
              <input
                type="text"
                id="missionObjective"
                name="missionObjective"
                value={formData.missionObjective}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-300 font-medium mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-300 font-medium mb-2">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Aborted">Aborted</option>
              </select>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="bg-gray-800 rounded-lg shadow-md p-6 text-gray-200">
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b-2 border-yellow-500 inline-block">Weather & Environmental Data</h3>
            
            <div className="mb-4">
              <label htmlFor="altitudeM" className="block text-gray-300 font-medium mb-2">Altitude (meters)</label>
              <input
                type="number"
                step="0.1"
                id="altitudeM"
                name="altitudeM"
                value={formData.altitudeM}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="windSpeedMS" className="block text-gray-300 font-medium mb-2">Wind Speed (m/s)</label>
              <input
                type="number"
                step="0.1"
                id="windSpeedMS"
                name="windSpeedMS"
                value={formData.windSpeedMS}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="flightDistanceKm" className="block text-gray-300 font-medium mb-2">Flight Distance (km)</label>
              <input
                type="number"
                step="0.1"
                id="flightDistanceKm"
                name="flightDistanceKm"
                value={formData.flightDistanceKm}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="weatherConditions" className="block text-gray-300 font-medium mb-2">Weather Conditions</label>
              <select
                id="weatherConditions"
                name="weatherConditions"
                value={formData.weatherConditions}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              >
                <option value="">Select weather condition</option>
                <option value="Clear">Clear</option>
                <option value="Partly Cloudy">Partly Cloudy</option>
                <option value="Cloudy">Cloudy</option>
                <option value="Overcast">Overcast</option>
                <option value="Light Rain">Light Rain</option>
                <option value="Rain">Rain</option>
                <option value="Heavy Rain">Heavy Rain</option>
                <option value="Snow">Snow</option>
                <option value="Fog">Fog</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="windConditions" className="block text-gray-300 font-medium mb-2">Wind Conditions</label>
              <select
                id="windConditions"
                name="windConditions"
                value={formData.windConditions}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              >
                <option value="">Select wind condition</option>
                <option value="Calm">Calm</option>
                <option value="Light Breeze">Light Breeze</option>
                <option value="Moderate Wind">Moderate Wind</option>
                <option value="Strong Wind">Strong Wind</option>
                <option value="Gust">Gust</option>
                <option value="Turbulence">Turbulence</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="temperatureC" className="block text-gray-300 font-medium mb-2">Temperature Range (°C)</label>
              <input
                type="text"
                id="temperatureC"
                name="temperatureC"
                value={formData.temperatureC}
                onChange={handleChange}
                placeholder="e.g., 20-25"
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="bg-gray-800 rounded-lg shadow-md p-6 text-gray-200">
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b-2 border-yellow-500 inline-block">Technical & Performance Data</h3>
            
            <div className="bg-gray-900 rounded-lg p-5 mb-6 border-l-4 border-yellow-500">
              <h4 className="text-lg font-medium mb-4 text-gray-200">Battery Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="batteryTakeoffVoltage3s" className="block text-gray-300 font-medium mb-2">3S Takeoff Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="batteryTakeoffVoltage3s"
                    name="batteryTakeoffVoltage3s"
                    value={formData.batteryTakeoffVoltage3s}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="batteryLandingVoltage3s" className="block text-gray-300 font-medium mb-2">3S Landing Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="batteryLandingVoltage3s"
                    name="batteryLandingVoltage3s"
                    value={formData.batteryLandingVoltage3s}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="battery3sQty" className="block text-gray-300 font-medium mb-2">3S Battery Quantity</label>
                  <input
                    type="number"
                    id="battery3sQty"
                    name="battery3sQty"
                    value={formData.battery3sQty}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="batteryTakeoffVoltage7s" className="block text-gray-300 font-medium mb-2">7S Takeoff Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="batteryTakeoffVoltage7s"
                    name="batteryTakeoffVoltage7s"
                    value={formData.batteryTakeoffVoltage7s}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="batteryLandingVoltage7s" className="block text-gray-300 font-medium mb-2">7S Landing Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="batteryLandingVoltage7s"
                    name="batteryLandingVoltage7s"
                    value={formData.batteryLandingVoltage7s}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="battery7sQty" className="block text-gray-300 font-medium mb-2">7S Battery Quantity</label>
                  <input
                    type="number"
                    id="battery7sQty"
                    name="battery7sQty"
                    value={formData.battery7sQty}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="batteryTakeoffVoltage14s" className="block text-gray-300 font-medium mb-2">14S Takeoff Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="batteryTakeoffVoltage14s"
                    name="batteryTakeoffVoltage14s"
                    value={formData.batteryTakeoffVoltage14s}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="batteryLandingVoltage14s" className="block text-gray-300 font-medium mb-2">14S Landing Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="batteryLandingVoltage14s"
                    name="batteryLandingVoltage14s"
                    value={formData.batteryLandingVoltage14s}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="battery14sQty" className="block text-gray-300 font-medium mb-2">14S Battery Quantity</label>
                  <input
                    type="number"
                    id="battery14sQty"
                    name="battery14sQty"
                    value={formData.battery14sQty}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="batteryHealth" className="block text-gray-300 font-medium mb-2">Battery Health</label>
                <select
                  id="batteryHealth"
                  name="batteryHealth"
                  value={formData.batteryHealth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                >
                  <option value="">Select battery health</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-5 border-l-4 border-yellow-500">
              <h4 className="text-lg font-medium mb-4 text-gray-200">Performance Data</h4>
              
              <div className="mb-4">
                <label htmlFor="droneOverallSystemHealthStatus" className="block text-gray-300 font-medium mb-2">System Health Status</label>
                <select
                  id="droneOverallSystemHealthStatus"
                  name="droneOverallSystemHealthStatus"
                  value={formData.droneOverallSystemHealthStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                >
                  <option value="">Select system health</option>
                  <option value="Optimal">Optimal</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="fuelLevelL" className="block text-gray-300 font-medium mb-2">Fuel Level (L)</label>
                <input
                  type="number"
                  step="0.1"
                  id="fuelLevelL"
                  name="fuelLevelL"
                  value={formData.fuelLevelL}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="weightKgBefore" className="block text-gray-300 font-medium mb-2">Weight Before (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="weightKgBefore"
                    name="weightKgBefore"
                    value={formData.weightKgBefore}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="weightKgAfter" className="block text-gray-300 font-medium mb-2">Weight After (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="weightKgAfter"
                    name="weightKgAfter"
                    value={formData.weightKgAfter}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="fuelConsumptionL" className="block text-gray-300 font-medium mb-2">Fuel Consumption (L)</label>
                <input
                  type="number"
                  step="0.1"
                  id="fuelConsumptionL"
                  name="fuelConsumptionL"
                  value={formData.fuelConsumptionL}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-300 font-medium mb-2">Comments</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter any additional information or notes about the flight"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-sans bg-gray-900 text-gray-200">
      {/* Progress Steps */}
      <div className="relative flex justify-between mb-10">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-700"></div>
        
        {/* Steps */}
        {SECTIONS.map((section, index) => (
          <div 
            key={index} 
            className={`relative flex flex-col items-center cursor-pointer z-10 transition-all duration-300`}
            onClick={() => setCurrentSection(index)}
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
              ${index === currentSection 
                ? 'bg-yellow-500 border-gray-200 text-black scale-110' 
                : index < currentSection 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-700'} 
              transition-all duration-300`}
            >
              {index + 1}
            </div>
            <div className={`mt-2 text-sm font-medium ${index === currentSection ? 'text-black' : 'text-gray-600'} 
              hidden sm:block`}
            >
              {section}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        {renderFormSection()}
        
        <div className="flex justify-between mt-8">
          {currentSection > 0 && (
            <button 
              type="button" 
              onClick={prevSection}
              className="px-6 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Previous
            </button>
          )}
          
          <button 
            type="button" 
            onClick={nextSection}
            className={`px-6 py-2 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 ${currentSection > 0 ? 'ml-auto' : ''}`}
          >
            {currentSection === SECTIONS.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlightLogForm;