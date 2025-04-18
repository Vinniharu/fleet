"use client";
import React, { useState } from 'react';

const FlightLogForm = ({ onSubmit, initialData = {} }) => {
  
  // Form sections
  const SECTIONS = ['Basic Information', 'Weather & Environment', 'Technical Data'];
  
  // State
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    flightTimestamp: initialData.flightTimestamp || new Date().toISOString().slice(0, 16),
    missionCoordinator: initialData.missionCoordinator || '',
    aircraftName: initialData.aircraftName || '',
    altitudeM: initialData.altitudeM || 0,
    windSpeedMps: initialData.windSpeedMps || 0,
    flightDistanceKm: initialData.flightDistanceKm || 0,
    batteryTakeoff3sV: initialData.batteryTakeoff3sV || 0,
    batteryTakeoff7sV: initialData.batteryTakeoff7sV || 0,
    batteryTakeoff14sV: initialData.batteryTakeoff14sV || 0,
    batteryLanding3sV: initialData.batteryLanding3sV || 0,
    batteryLanding7sV: initialData.batteryLanding7sV || 0,
    batteryLanding14sV: initialData.batteryLanding14sV || 0,
    battery3sQty: initialData.battery3sQty || 0,
    battery7sQty: initialData.battery7sQty || 0,
    battery14sQty: initialData.battery14sQty || 0,
    batteryHealth: initialData.batteryHealth || 'Good',
    systemHealthStatus: initialData.systemHealthStatus || 'Nominal',
    weatherConditions: initialData.weatherConditions || '',
    windConditions: initialData.windConditions || '',
    temperatureC: initialData.temperatureC || 0,
    flightYear: initialData.flightYear || new Date().getFullYear(),
    flightMonth: initialData.flightMonth || 1,
    flightWeek: initialData.flightWeek || 1,
    flightTimeMinutes: initialData.flightTimeMinutes || 0,
    missionObjective: initialData.missionObjective || '',
    description: initialData.description || '',
    status: initialData.status || 'Planned',
    comment: initialData.comment || '',
    fuelLevelL: initialData.fuelLevelL || '',
    fuelConsumptionL: initialData.fuelConsumptionL || '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:  value
    }));
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
  const handleSubmit = () => {
    onSubmit(formData);
    console.log(formData);
  };

  // Generate year options (current year and 5 years back)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Generate month options
  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" }
  ];

  // Generate week options (1-52)
  const weekOptions = Array.from({ length: 52 }, (_, i) => i + 1);


  // Render form section
  const renderFormSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="bg-gray-800 rounded-lg shadow-md p-6 text-gray-200">
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b-2 border-yellow-500 inline-block">Basic Flight Information</h3>
            
            <div className="mb-4">
              <label htmlFor="flightTimestamp" className="block text-gray-300 font-medium mb-2">Flight Date & Time</label>
              <input
                type="datetime-local"
                id="flightTimestamp"
                name="flightTimestamp"
                value={formData.flightTimestamp.split('Z')[0]}
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
              <label htmlFor="aircraftName" className="block text-gray-300 font-medium mb-2">Aircraft Name</label>
              <input
                type="text"
                id="aircraftName"
                name="aircraftName"
                value={formData.aircraftName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="flightYear" className="block text-gray-300 font-medium mb-2">Year</label>
                <select
                  id="flightYear"
                  name="flightYear"
                  value={formData.flightYear}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="flightMonth" className="block text-gray-300 font-medium mb-2">Month</label>
                <select
                  id="flightMonth"
                  name="flightMonth"
                  value={formData.flightMonth}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                >
                  <option value="">Select month</option>
                  {monthOptions.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="flightWeek" className="block text-gray-300 font-medium mb-2">Week</label>
                <select
                  id="flightWeek"
                  name="flightWeek"
                  value={formData.flightWeek}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                >
                  <option value="">Select week</option>
                  {weekOptions.map(week => (
                    <option key={week} value={week}>{week}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="flightTimeMinutes" className="block text-gray-300 font-medium mb-2">Flight Time (minutes)</label>
              <input
                type="number"
                id="flightTimeMinutes"
                name="flightTimeMinutes"
                value={formData.flightTimeMinutes}
                onChange={handleChange}
                min="0"
                step="1"
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
              <label htmlFor="status" className="block text-gray-300 font-medium mb-2">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Aborted">Aborted</option>
                <option value="Cancelled">Cancelled</option>
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
              <label htmlFor="windSpeedMps" className="block text-gray-300 font-medium mb-2">Wind Speed (m/s)</label>
              <input
                type="number"
                step="0.1"
                id="windSpeedMps"
                name="windSpeedMps"
                value={formData.windSpeedMps}
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
                  <label htmlFor="batteryTakeoff3sV" className="block text-gray-300 font-medium mb-2">3S Takeoff Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="batteryTakeoff3sV"
                    name="batteryTakeoff3sV"
                    value={formData.batteryTakeoff3sV}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="batteryLanding3sV" className="block text-gray-300 font-medium mb-2">3S Landing Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="batteryLanding3sV"
                    name="batteryLanding3sV"
                    value={formData.batteryLanding3sV}
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
                  <label htmlFor="batteryTakeoff7sV" className="block text-gray-300 font-medium mb-2">7S Takeoff Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="batteryTakeoff7sV"
                    name="batteryTakeoff7sV"
                    value={formData.batteryTakeoff7sV}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="batteryLanding7sV" className="block text-gray-300 font-medium mb-2">7S Landing Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="batteryLanding7sV"
                    name="batteryLanding7sV"
                    value={formData.batteryLanding7sV}
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
                  <label htmlFor="batteryTakeoff14sV" className="block text-gray-300 font-medium mb-2">14S Takeoff Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="batteryTakeoff14sV"
                    name="batteryTakeoff14sV"
                    value={formData.batteryTakeoff14sV}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="batteryLanding14sV" className="block text-gray-300 font-medium mb-2">14S Landing Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="batteryLanding14sV"
                    name="batteryLanding14sV"
                    value={formData.batteryLanding14sV}
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
                <label htmlFor="systemHealthStatus" className="block text-gray-300 font-medium mb-2">System Health Status</label>
                <select
                  id="systemHealthStatus"
                  name="systemHealthStatus"
                  value={formData.systemHealthStatus}
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
              
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              </div> */}
              
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
    <div className=" mx-auto px-4 py-8 font-sans bg-gray-900 text-gray-200">
      {/* Progress Steps */}
      <div className="relative flex justify-between mb-10">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-700"></div>
        
        {/* Steps */}
        {SECTIONS.map((section, index) => (
          <div 
            key={index} 
            className={`relative flex flex-col items-center cursor-pointer transition-all duration-300`}
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
            <div className={`mt-2 text-sm font-medium ${index === currentSection ? 'text-yellow-500' : 'text-gray-600'} 
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