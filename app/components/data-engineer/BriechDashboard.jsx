"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Tooltip, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

export default function BriechDashboard({ droneFlightData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredFlight, setHoveredFlight] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('altitudeM');
  const [selectedDroneType, setSelectedDroneType] = useState('all');
  
  const totalFlights = droneFlightData.length;

  // Extract unique drone types
  const droneTypes = [...new Set(droneFlightData.map(flight => flight.nameOfAircraft))];
  
  // Filter data based on selected drone type
  const filteredData = selectedDroneType === 'all' 
    ? droneFlightData 
    : droneFlightData.filter(flight => flight.nameOfAircraft === selectedDroneType);

  // Calculate averages and maximums for key metrics
  const metrics = {
    altitudeM: {
      label: 'Altitude (m)',
      max: Math.max(...filteredData.map(item => item.altitudeM)),
      avg: filteredData.reduce((sum, item) => sum + item.altitudeM, 0) / filteredData.length,
      data: filteredData.map(item => item.altitudeM)
    },
    flightDistanceKm: {
      label: 'Flight Distance (km)',
      max: Math.max(...filteredData.map(item => item.flightDistanceKm)),
      avg: filteredData.reduce((sum, item) => sum + item.flightDistanceKm, 0) / filteredData.length,
      data: filteredData.map(item => item.flightDistanceKm)
    },
    windSpeedMS: {
      label: 'Wind Speed (m/s)',
      max: Math.max(...filteredData.map(item => item.windSpeedMS)),
      avg: filteredData.reduce((sum, item) => sum + item.windSpeedMS, 0) / filteredData.length,
      data: filteredData.map(item => item.windSpeedMS)
    },
    flightTime: {
      label: 'Flight Time (min)',
      max: Math.max(...filteredData.map(item => {
        const [h, m, s] = item.flightTime.split(':').map(Number);
        return h * 60 + m + s / 60;
      })),
      avg: filteredData.reduce((sum, item) => {
        const [h, m, s] = item.flightTime.split(':').map(Number);
        return sum + h * 60 + m + s / 60;
      }, 0) / filteredData.length,
      data: filteredData.map(item => {
        const [h, m, s] = item.flightTime.split(':').map(Number);
        return h * 60 + m + s / 60;
      })
    },
    fuelConsumptionL: {
      label: 'Fuel Consumption (L)',
      max: Math.max(...filteredData.map(item => item.fuelConsumptionL)),
      avg: filteredData.reduce((sum, item) => sum + item.fuelConsumptionL, 0) / filteredData.length,
      data: filteredData.map(item => item.fuelConsumptionL)
    }
  };

  // Calculate flight time distribution by drone type
  const flightTimeByDrone = {};
  droneFlightData.forEach(flight => {
    const aircraft = flight.nameOfAircraft;
    const [h, m, s] = flight.flightTime.split(':').map(Number);
    const timeInMinutes = h * 60 + m + s / 60;
    
    if (!flightTimeByDrone[aircraft]) {
      flightTimeByDrone[aircraft] = timeInMinutes;
    } else {
      flightTimeByDrone[aircraft] += timeInMinutes;
    }
  });

  const pieData = Object.keys(flightTimeByDrone).map(drone => ({
    name: drone,
    value: flightTimeByDrone[drone]
  }));

  // Process data for timeline visualization
  const timelineData = filteredData
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map((flight, index) => ({
      name: new Date(flight.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      altitude: flight.altitudeM,
      distance: flight.flightDistanceKm,
      wind: flight.windSpeedMS,
      id: index
    }));

  // Create data for radar chart comparing drone health metrics
  const healthStatusCounts = {};
  droneFlightData.forEach(flight => {
    const status = flight.droneOverallSystemHealthStatus;
    if (!healthStatusCounts[status]) {
      healthStatusCounts[status] = 1;
    } else {
      healthStatusCounts[status]++;
    }
  });

  const radarData = [
    { subject: 'Altitude', A: metrics.altitudeM.avg, fullMark: metrics.altitudeM.max },
    { subject: 'Distance', A: metrics.flightDistanceKm.avg, fullMark: metrics.flightDistanceKm.max },
    { subject: 'Wind Speed', A: metrics.windSpeedMS.avg, fullMark: metrics.windSpeedMS.max },
    { subject: 'Flight Time', A: metrics.flightTime.avg, fullMark: metrics.flightTime.max },
    { subject: 'Fuel Usage', A: metrics.fuelConsumptionL.avg, fullMark: metrics.fuelConsumptionL.max }
  ];

  // Format time from minutes to hh:mm
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  // Colors
  const COLORS = ['#FFD700', '#FFC107', '#FFAB00', '#FF9800', '#FF8F00', '#FF6F00'];
  
  // Gauge chart implementation
  const GaugeChart = ({ value, max, label, color }) => {
    const percentage = (value / max) * 100;
    
    return (
      <div className="relative">
        <div className="text-center mb-2 text-yellow-500 text-sm font-medium">{label}</div>
        <div className="relative h-40 w-40 mx-auto">
          <svg viewBox="0 0 100 50" className="w-full">
            {/* Background arc */}
            <path
              d="M 10 50 A 40 40 0 1 1 90 50"
              fill="none"
              stroke="#333"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Value arc */}
            <path
              d={`M 10 50 A 40 40 0 ${percentage > 50 ? 1 : 0} 1 ${
                10 + 80 * (percentage / 100)
              } ${50 - Math.sin((percentage / 100) * Math.PI) * 40}`}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl text-white font-bold">{typeof value === 'number' ? value.toFixed(1) : value}</div>
            <div className="text-xs text-yellow-400">
              {typeof max === 'number' ? `Max: ${max.toFixed(1)}` : ''}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalFlights - 1 ? prev + 1 : prev));
  };

  // Chart data preparation
  const altitudeChartData = droneFlightData.map((item, index) => ({
    name: item.timestamp.substring(5, 10),
    altitude: item.altitudeM
  }));

  // Calculate cumulative flight time per drone
  const flightTimePerDrone = {};
  droneFlightData.forEach(flight => {
    const aircraft = flight.nameOfAircraft;
    const timeStr = flight.flightTime;
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes + seconds / 60;
    
    if (!flightTimePerDrone[aircraft]) {
      flightTimePerDrone[aircraft] = timeInMinutes;
    } else {
      flightTimePerDrone[aircraft] += timeInMinutes;
    }
  });

  const barChartData = Object.keys(flightTimePerDrone).map(drone => ({
    name: drone.replace(' ', '\n'),
    minutes: flightTimePerDrone[drone]
  }));

  // Prepare distance/flight time chart data
  const distanceChartData = droneFlightData.map((item, index) => ({
    name: index.toString(),
    distance: item.flightDistanceKm
  }));

  // Get current flight data
  const currentFlight = droneFlightData[currentIndex];
  const flightTime = currentFlight.flightTime;
  const [hours, minutes, seconds] = flightTime.split(':').map(Number);
  const timeInMinutes = hours * 60 + minutes + seconds / 60;

  // Format timestamp for display
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto p-6">
        {/* Dashboard Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Briech UAS Fleet Analytics
          </h1>
          <p className="text-sm text-yellow-500/80 font-light mt-2">
            Comprehensive data visualization for {filteredData.length} drone flights
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg flex flex-wrap gap-4 justify-between items-center">
          <div>
            <label className="text-sm text-yellow-500 mb-2 block">Select Drone Type</label>
            <select 
              value={selectedDroneType} 
              onChange={(e) => setSelectedDroneType(e.target.value)}
              className="bg-gray-950/50 border border-yellow-500/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="all">All Drones</option>
              {droneTypes.map(drone => (
                <option key={drone} value={drone}>{drone}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm text-yellow-500 mb-2 block">Primary Metric for Analysis</label>
            <select 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="bg-gray-950/50 border border-yellow-500/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              {Object.keys(metrics).map(metric => (
                <option key={metric} value={metric}>{metrics[metric].label}</option>
              ))}
            </select>
          </div>
          
          <div className="bg-gray-950/50 p-3 rounded-lg border border-yellow-500/20">
            <div className="text-sm text-yellow-500 mb-1">Total Flights</div>
            <div className="text-2xl font-bold text-white">{filteredData.length}</div>
          </div>
        </div>

        {/* Gauges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg flex flex-col items-center">
            <GaugeChart 
              value={metrics.altitudeM.avg} 
              max={metrics.altitudeM.max} 
              label="Avg Altitude (m)" 
              color="#FFD700" 
            />
          </div>
          
          <div className="bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg flex flex-col items-center">
            <GaugeChart 
              value={metrics.flightDistanceKm.avg} 
              max={metrics.flightDistanceKm.max} 
              label="Avg Distance (km)" 
              color="#FFC107" 
            />
          </div>
          
          <div className="bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg flex flex-col items-center">
            <GaugeChart 
              value={metrics.windSpeedMS.avg} 
              max={metrics.windSpeedMS.max} 
              label="Avg Wind Speed (m/s)" 
              color="#FF9800" 
            />
          </div>
          
          <div className="bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg flex flex-col items-center">
            <GaugeChart 
              value={metrics.flightTime.avg} 
              max={metrics.flightTime.max} 
              label="Avg Flight Time (min)" 
              color="#FFAB00" 
            />
          </div>
          
          <div className="bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg flex flex-col items-center">
            <GaugeChart 
              value={metrics.fuelConsumptionL.avg} 
              max={metrics.fuelConsumptionL.max} 
              label="Avg Fuel Usage (L)" 
              color="#FF8F00" 
            />
          </div>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Timeline Chart */}
          <div className="bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg">
            <h3 className="text-yellow-500 font-medium mb-4">Flight Data Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', borderColor: '#FFD700' }}
                  labelStyle={{ color: '#FFD700' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="altitude" 
                  name="Altitude (m)"
                  stroke="#FFD700" 
                  activeDot={{ r: 8 }} 
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="distance" 
                  name="Distance (km)"
                  stroke="#FF9800" 
                  activeDot={{ r: 8 }} 
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="wind" 
                  name="Wind Speed (m/s)"
                  stroke="#FFC107" 
                  activeDot={{ r: 8 }} 
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Flight Time Per Drone */}
          <div className="bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg">
            <h3 className="text-yellow-500 font-medium mb-4">Flight Time Distribution by Drone</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatTime(value)}
                      contentStyle={{ backgroundColor: '#333', borderColor: '#FFD700' }}
                      labelStyle={{ color: '#FFD700' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center">
                <div className="space-y-2">
                  {pieData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div 
                        className="w-4 h-4 mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <div className="text-sm">
                        <span className="text-white">{entry.name}:</span>
                        <span className="text-yellow-400 ml-2">{formatTime(entry.value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Drone Health Status */}
          <div className="bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg">
            <h3 className="text-yellow-500 font-medium mb-4">System Health Status Distribution</h3>
            <div className="space-y-4">
              {Object.entries(healthStatusCounts).map(([status, count], index) => (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white">{status}</span>
                    <span className="text-yellow-400">{count} flights</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${(count / droneFlightData.length) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flight Performance Radar */}
          <div className="bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg">
            <h3 className="text-yellow-500 font-medium mb-4">Flight Performance Metrics</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="subject" stroke="#888" />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#888" />
                <Radar
                  name="Average"
                  dataKey="A"
                  stroke="#FFD700"
                  fill="#FFD700"
                  fillOpacity={0.5}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', borderColor: '#FFD700' }}
                  labelStyle={{ color: '#FFD700' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Metric Distribution */}
          <div className="bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg">
            <h3 className="text-yellow-500 font-medium mb-4">{metrics[selectedMetric].label} Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={filteredData.map((item, idx) => ({ 
                name: idx + 1, 
                value: selectedMetric === 'flightTime' 
                  ? (() => {
                      const [h, m, s] = item.flightTime.split(':').map(Number);
                      return h * 60 + m + s / 60;
                    })() 
                  : item[selectedMetric] 
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  formatter={(value) => selectedMetric === 'flightTime' ? formatTime(value) : value.toFixed(2)}
                  contentStyle={{ backgroundColor: '#333', borderColor: '#FFD700' }}
                  labelStyle={{ color: '#FFD700' }}
                />
                <Bar dataKey="value" fill="#FFD700">
                  {filteredData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-gray-900/70 p-6 rounded-xl border border-yellow-500/20 shadow-lg">
          <h3 className="text-yellow-500 font-medium mb-4 text-center">Flight Data Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-yellow-500/80 text-sm mb-3">Flight Conditions</h4>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Average Altitude</span>
                  <span className="text-white">{metrics.altitudeM.avg.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Maximum Altitude</span>
                  <span className="text-white">{metrics.altitudeM.max.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Average Wind Speed</span>
                  <span className="text-white">{metrics.windSpeedMS.avg.toFixed(1)} m/s</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Average Distance</span>
                  <span className="text-white">{metrics.flightDistanceKm.avg.toFixed(1)} km</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-yellow-500/80 text-sm mb-3">Flight Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Average Flight Time</span>
                  <span className="text-white">{formatTime(metrics.flightTime.avg)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Maximum Flight Time</span>
                  <span className="text-white">{formatTime(metrics.flightTime.max)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Total Flight Time</span>
                  <span className="text-white">{formatTime(metrics.flightTime.data.reduce((a, b) => a + b, 0))}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Avg Fuel Consumption</span>
                  <span className="text-white">{metrics.fuelConsumptionL.avg.toFixed(2)} L</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-yellow-500/80 text-sm mb-3">Mission Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Completed Missions</span>
                  <span className="text-white">
                    {filteredData.filter(flight => flight.status === "Completed").length} 
                    <span className="text-xs text-gray-400 ml-1">
                      ({Math.round(filteredData.filter(flight => flight.status === "Completed").length / filteredData.length * 100)}%)
                    </span>
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Aborted Missions</span>
                  <span className="text-white">
                    {filteredData.filter(flight => flight.status === "Aborted").length}
                    <span className="text-xs text-gray-400 ml-1">
                      ({Math.round(filteredData.filter(flight => flight.status === "Aborted").length / filteredData.length * 100)}%)
                    </span>
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Total Distance Covered</span>
                  <span className="text-white">{filteredData.reduce((sum, flight) => sum + flight.flightDistanceKm, 0).toFixed(1)} km</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Total Fuel Used</span>
                  <span className="text-white">{filteredData.reduce((sum, flight) => sum + flight.fuelConsumptionL, 0).toFixed(2)} L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}