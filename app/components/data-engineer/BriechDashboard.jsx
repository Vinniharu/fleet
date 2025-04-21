"use client";

import { useState, useEffect, useRef } from "react";
import * as d3 from 'd3';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";

// Helper function outside component to render D3 gauge
const renderD3Gauge = (node, value, max, color) => {
  if (!node) return;
  
  const width = node.clientWidth;
  const height = node.clientHeight;
  const radius = Math.min(width, height) / 2;

  // Clear previous SVG
  d3.select(node).selectAll("*").remove();

  const svg = d3.select(node)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height - 10})`);

  // Create a scale for the gauge
  const scale = d3.scaleLinear()
    .domain([0, max])
    .range([-Math.PI / 2, Math.PI / 2])
    .clamp(true);

  // Create the arc
  const arc = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius * 0.8)
    .startAngle(-Math.PI / 2);

  // Background arc
  svg.append("path")
    .datum({endAngle: Math.PI / 2})
    .style("fill", "#333")
    .attr("d", arc);

  // Foreground arc (value)
  svg.append("path")
    .datum({endAngle: scale(value)})
    .style("fill", color)
    .attr("d", arc);

  // Add text for the value
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", `-${radius * 0.15}`)
    .attr("dx", "0")
    .text(value.toFixed(1))
    .style("font-size", `${Math.floor(radius * 0.4)}px`)
    .style("fill", "white");

  // Add the max value
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", `-${radius * 1}`)
    .attr("dx", "0")
    .text(`Max: ${max.toFixed(1)}`)
    .style("font-size", `${Math.floor(radius * 0.4)}px`)
    .style("fill", "#FFD700");
};

// Format time from minutes to hh:mm
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  return `${hours}h ${mins}m`;
};

// Calculate flight time in minutes helper
const getFlightTimeInMinutes = (item) => {
  if (item.flightTimeMinutes) return item.flightTimeMinutes;
  else if (item.flightTime) {
    const [h, m, s] = item.flightTime.split(":").map(Number);
    return h * 60 + m + s / 60;
  }
  return 0;
};

export default function BriechDashboard({ droneFlightData, data, isLoading }) {
  // All state hooks at the top
  const [selectedMetric, setSelectedMetric] = useState("altitudeM");
  const [selectedDroneType, setSelectedDroneType] = useState("all");
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  
  // All ref hooks next
  const containerRef = useRef(null);
  const gaugeRefs = {
    altitude: useRef(null),
    distance: useRef(null),
    windSpeed: useRef(null),
    flightTime: useRef(null),
  };

  // Accept either droneFlightData or data prop
  const flightDataInput = droneFlightData || data || [];
  const safeFlightData = Array.isArray(flightDataInput) ? flightDataInput : [];
  const totalFlights = safeFlightData.length;
  
  // Calculate data for all cases, even if we'll return early
  // This ensures hooks are always called in the same order
  const droneTypes = totalFlights > 0 
    ? [...new Set(safeFlightData.map((flight) => flight.aircraftName || 'Unknown'))]
    : [];
    
  const filteredData = totalFlights > 0
    ? (selectedDroneType === "all"
      ? safeFlightData
      : safeFlightData.filter((flight) => flight.aircraftName === selectedDroneType))
    : [];

  // Calculate metrics with safe defaults for empty data
  const metrics = {
    altitudeM: {
      label: "Altitude (m)",
      max: filteredData.length > 0 ? Math.max(...filteredData.map((item) => item.altitudeM || 0)) : 0,
      avg: filteredData.length > 0 
        ? filteredData.reduce((sum, item) => sum + (item.altitudeM || 0), 0) / filteredData.length
        : 0,
      data: filteredData.map((item) => item.altitudeM || 0),
    },
    flightDistanceKm: {
      label: "Flight Distance (km)",
      max: filteredData.length > 0 ? Math.max(...filteredData.map((item) => item.flightDistanceKm || 0)) : 0,
      avg: filteredData.length > 0
        ? filteredData.reduce((sum, item) => sum + (item.flightDistanceKm || 0), 0) / filteredData.length
        : 0,
      data: filteredData.map((item) => item.flightDistanceKm || 0),
    },
    windSpeedMps: {
      label: "Wind Speed (m/s)",
      max: filteredData.length > 0 ? Math.max(...filteredData.map((item) => item.windSpeedMps || 0)) : 0,
      avg: filteredData.length > 0
        ? filteredData.reduce((sum, item) => sum + (item.windSpeedMps || 0), 0) / filteredData.length
        : 0,
      data: filteredData.map((item) => item.windSpeedMps || 0),
    },
    flightTimeMinutes: {
      label: "Flight Time (min)",
      max: filteredData.length > 0 
        ? Math.max(...filteredData.map((item) => getFlightTimeInMinutes(item)))
        : 0,
      avg: filteredData.length > 0
        ? filteredData.reduce((sum, item) => sum + getFlightTimeInMinutes(item), 0) / filteredData.length
        : 0,
      data: filteredData.map((item) => getFlightTimeInMinutes(item)),
    },
    fuelConsumptionL: {
      label: "Fuel Consumption (L)",
      max: filteredData.length > 0 ? Math.max(...filteredData.map((item) => item.fuelConsumptionL || 0)) : 0,
      avg: filteredData.length > 0
        ? filteredData.reduce((sum, item) => sum + (item.fuelConsumptionL || 0), 0) / filteredData.length
        : 0,
      data: filteredData.map((item) => item.fuelConsumptionL || 0),
    },
  };

  // Calculate health status counts
  const healthStatusCounts = {};
  if (safeFlightData.length > 0) {
    safeFlightData.forEach((flight) => {
      const status = flight.systemHealthStatus || 'Unknown';
      healthStatusCounts[status] = (healthStatusCounts[status] || 0) + 1;
    });
  }

  // Calculate flight time by drone
  const flightTimeByDrone = {};
  if (safeFlightData.length > 0) {
    safeFlightData.forEach((flight) => {
      const aircraft = flight.aircraftName || 'Unknown';
      const timeInMinutes = getFlightTimeInMinutes(flight);
      flightTimeByDrone[aircraft] = (flightTimeByDrone[aircraft] || 0) + timeInMinutes;
    });
  }

  const pieData = Object.keys(flightTimeByDrone).map((drone) => ({
    name: drone,
    value: flightTimeByDrone[drone],
  }));

  // Process data for timeline visualization
  const timelineData = filteredData.length > 0
    ? filteredData
      .sort((a, b) => {
        const dateA = new Date(a.flightTimestamp || 0).getTime();
        const dateB = new Date(b.flightTimestamp || 0).getTime();
        return dateA - dateB;
      })
      .map((flight, index) => ({
        name: flight.flightTimestamp 
          ? new Date(flight.flightTimestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : `Flight ${index + 1}`,
        altitude: flight.altitudeM || 0,
        distance: flight.flightDistanceKm || 0,
        wind: flight.windSpeedMps || 0,
        id: index,
      }))
    : [];

  // Create data for radar chart
  const radarData = [
    {
      subject: "Altitude",
      A: metrics.altitudeM.avg,
      fullMark: metrics.altitudeM.max || 1,
    },
    {
      subject: "Distance",
      A: metrics.flightDistanceKm.avg,
      fullMark: metrics.flightDistanceKm.max || 1,
    },
    {
      subject: "Wind Speed",
      A: metrics.windSpeedMps.avg,
      fullMark: metrics.windSpeedMps.max || 1,
    },
    {
      subject: "Flight Time",
      A: metrics.flightTimeMinutes.avg,
      fullMark: metrics.flightTimeMinutes.max || 1,
    },
    {
      subject: "Fuel Usage",
      A: metrics.fuelConsumptionL.avg,
      fullMark: metrics.fuelConsumptionL.max || 1,
    },
  ];

  // Colors
  const COLORS = [
    "#FFD700", "#FFC107", "#FFAB00", "#FF9800", "#FF8F00", "#FF6F00",
  ];

  // Container dimensions effect
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width, height });
    }

    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // D3 Gauge chart effect - always runs regardless of data
  useEffect(() => {
    // Only attempt to render if we have data and refs are available
    if (filteredData.length > 0) {
      if (gaugeRefs.altitude.current) 
        renderD3Gauge(gaugeRefs.altitude.current, metrics.altitudeM.avg, metrics.altitudeM.max || 1, "#FFD700");
      if (gaugeRefs.distance.current) 
        renderD3Gauge(gaugeRefs.distance.current, metrics.flightDistanceKm.avg, metrics.flightDistanceKm.max || 1, "#FFC107");
      if (gaugeRefs.windSpeed.current) 
        renderD3Gauge(gaugeRefs.windSpeed.current, metrics.windSpeedMps.avg, metrics.windSpeedMps.max || 1, "#FF9800");
      if (gaugeRefs.flightTime.current) 
        renderD3Gauge(gaugeRefs.flightTime.current, metrics.flightTimeMinutes.avg, metrics.flightTimeMinutes.max || 1, "#FFAB00");
    } else {
      // If no data, render empty gauges
      Object.values(gaugeRefs).forEach(ref => {
        if (ref.current) {
          d3.select(ref.current).selectAll("*").remove();
        }
      });
    }
  }, [metrics, containerDimensions, filteredData]);

  // Return early with a message if no flight data is available
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900/70 p-8 rounded-xl border border-yellow-500/20 shadow-lg text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
            Loading Flight Data...
          </h2>
          <p className="text-white">
            Please wait while we load the flight data.
          </p>
        </div>
      </div>
    );
  }

  if (totalFlights === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900/70 p-8 rounded-xl border border-yellow-500/20 shadow-lg text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
            No Flight Data Available
          </h2>
          <p className="text-white">
            There is no flight data to display. Please check your data source.
          </p>
        </div>
      </div>
    );
  }

  try {
    return (
      <div ref={containerRef} className="h-screen w-full bg-black flex flex-col p-1">
        <div className="flex-1 grid grid-cols-12 gap-1" style={{ height: 'calc(100vh - 8px)' }}>
          {/* Header - spans full width, reduced height */}
          <div className="col-span-12 bg-gray-900/70 rounded-lg p-1 border border-yellow-500/20 shadow-lg flex items-center justify-between" style={{ height: '8vh' }}>
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Briech UAS Fleet Analytics
              </h1>
              <p className="text-[12px] text-yellow-500/80 font-light">
                {filteredData.length} drone flights
              </p>
            </div>

            <div className="flex items-center space-x-1">
              <select
                value={selectedDroneType}
                onChange={(e) => setSelectedDroneType(e.target.value)}
                className="bg-gray-950/50 border border-yellow-500/20 rounded text-white text-[12px] px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
              >
                <option value="all">All Drones</option>
                {droneTypes.map((drone) => (
                  <option key={drone} value={drone}>
                    {drone}
                  </option>
                ))}
              </select>

              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="bg-gray-950/50 border border-yellow-500/20 rounded text-white text-[12px] px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
              >
                {Object.keys(metrics).map((metric) => (
                  <option key={metric} value={metric}>
                    {metrics[metric].label}
                  </option>
                ))}
              </select>

              <div className="bg-gray-950/50 px-1 py-0.5 rounded border border-yellow-500/20 text-center">
                <div className="text-[12px] text-yellow-500">Flights</div>
                <div className="text-sm font-bold text-white">{filteredData.length}</div>
              </div>
            </div>
          </div>

          {/* Gauges Row - D3.js powered, compact layout */}
          <div className="col-span-3 bg-gray-900/70 rounded-lg p-1 border border-yellow-500/20 shadow-lg flex flex-col" style={{ height: '12vh' }}>
            <div className="text-[12px] text-yellow-500 font-medium mb-1 text-center">
              {metrics.altitudeM.label}
            </div>
            <div ref={gaugeRefs.altitude} className="flex-1 w-full"></div>
          </div>

          <div className="col-span-3 bg-gray-900/70 rounded-lg p-1 border border-yellow-500/20 shadow-lg flex flex-col" style={{ height: '12vh' }}>
            <div className="text-[12px] text-yellow-500 font-medium mb-1 text-center">
              {metrics.flightDistanceKm.label}
            </div>
            <div ref={gaugeRefs.distance} className="flex-1 w-full"></div>
          </div>

          <div className="col-span-3 bg-gray-900/70 rounded-lg p-1 border border-yellow-500/20 shadow-lg flex flex-col" style={{ height: '12vh' }}>
            <div className="text-[12px] text-yellow-500 font-medium mb-1 text-center">
              {metrics.windSpeedMps.label}
            </div>
            <div ref={gaugeRefs.windSpeed} className="flex-1 w-full"></div>
          </div>

          <div className="col-span-3 bg-gray-900/70 rounded-lg p-1 border border-yellow-500/20 shadow-lg flex flex-col" style={{ height: '12vh' }}>
            <div className="text-[12px] text-yellow-500 font-medium mb-1 text-center">
              {metrics.flightTimeMinutes.label}
            </div>
            <div ref={gaugeRefs.flightTime} className="flex-1 w-full"></div>
          </div>

          {/* Main Charts - more vertical space */}
          <div className="col-span-6 bg-gray-900/70 rounded-lg p-1 border border-yellow-500/20 shadow-lg flex flex-col" style={{ height: '40vh' }}>
            <div className="text-[12px] text-yellow-500 font-medium mb-1">Flight Data Timeline</div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timelineData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" tick={{fontSize: 10}} tickMargin={5} />
                  <YAxis stroke="#888" tick={{fontSize: 10}} width={30} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#333",
                      borderColor: "#FFD700",
                      fontSize: "12px",
                      padding: "2px 4px"
                    }}
                    labelStyle={{ color: "#FFD700" }}
                  />
                  <Legend wrapperStyle={{fontSize: "10px"}} />
                  <Line
                    type="monotone"
                    dataKey="altitude"
                    name="Altitude (m)"
                    stroke="#FFD700"
                    activeDot={{ r: 4 }}
                    dot={{ r: 1 }}
                    strokeWidth={1.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="distance"
                    name="Distance (km)"
                    stroke="#FF9800"
                    activeDot={{ r: 4 }}
                    dot={{ r: 1 }}
                    strokeWidth={1.5}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-6 bg-gray-900/70 rounded-lg p-1 border border-yellow-500/20 shadow-lg flex flex-col" style={{ height: '40vh' }}>
            <div className="text-[12px] text-yellow-500 font-medium mb-1">Flight Time Distribution</div>
            <div className="flex-1 flex">
              <div className="w-3/5 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatTime(Number(value))}
                      contentStyle={{
                        backgroundColor: "#333",
                        borderColor: "#FFD700",
                        fontSize: "12px",
                        padding: "2px 4px"
                      }}
                      labelStyle={{ color: "#FFD700" }}
                    />
                    <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: "10px", paddingLeft: "10px"}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-2/5 h-full overflow-auto flex flex-col justify-center">
                <div className="space-y-1">
                  {pieData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center text-[10px]">
                      <div
                        className="w-2 h-2 mr-1"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <div className="truncate">
                        <span className="text-white">{entry.name}</span>:
                        <span className="text-yellow-400 ml-1">
                          {formatTime(entry.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row Charts - compact layout */}
          <div className="col-span-4 bg-gray-900/70 rounded-lg p-1 border border-yellow-500/20 shadow-lg flex flex-col" style={{ height: '39vh' }}>
            <div className="text-[12px] text-yellow-500 font-medium mb-1">System Health Distribution</div>
            <div className="flex-1 overflow-auto">
              <div className="space-y-1">
                {Object.entries(healthStatusCounts).map(
                  ([status, count], index) => (
                    <div key={status} className="space-y-0.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white">{status}</span>
                        <span className="text-yellow-400">{count}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div
                          className="h-1 rounded-full"
                          style={{
                            width: `${(count / safeFlightData.length) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="col-span-4 bg-gray-900/70 rounded-lg p-1 border border-yellow-500/20 shadow-lg flex flex-col" style={{ height: '39vh' }}>
            <div className="text-[12px] text-yellow-500 font-medium mb-1">Performance Metrics</div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#444" />
                  <PolarAngleAxis dataKey="subject" stroke="#888" tick={{fontSize: 10}} />
                  <PolarRadiusAxis angle={30} domain={[0, "auto"]} stroke="#888" tick={{fontSize: 10}} />
                  <Radar
                    name="Average"
                    dataKey="A"
                    stroke="#FFD700"
                    fill="#FFD700"
                    fillOpacity={0.5}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#333",
                      borderColor: "#FFD700",
                      fontSize: "12px",
                      padding: "2px 4px"
                    }}
                    labelStyle={{ color: "#FFD700" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-4 bg-gray-900/70 rounded-lg p-1 border border-yellow-500/20 shadow-lg flex flex-col" style={{ height: '39vh' }}>
            <div className="text-[12px] text-yellow-500 font-medium mb-1">
              {metrics[selectedMetric].label} Distribution
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData.map((item, idx) => ({
                    name: idx + 1,
                    value:
                      selectedMetric === "flightTimeMinutes"
                        ? getFlightTimeInMinutes(item)
                        : item[selectedMetric] || 0,
                  }))}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" tick={{fontSize: 10}} tickMargin={5} />
                  <YAxis stroke="#888" tick={{fontSize: 10}} width={30} />
                  <Tooltip
                    formatter={(value) => {
                      if (selectedMetric === "flightTimeMinutes") {
                        return formatTime(Number(value));
                      }
                      return typeof value === 'number' ? value.toFixed(2) : String(value);
                    }}
                    contentStyle={{
                      backgroundColor: "#333",
                      borderColor: "#FFD700",
                      fontSize: "12px",
                      padding: "2px 4px"
                    }}
                    labelStyle={{ color: "#FFD700" }}
                  />
                  <Bar dataKey="value" fill="#FFD700" maxBarSize={20}>
                    {filteredData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering BriechDashboard:", error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900/70 p-8 rounded-xl border border-yellow-500/20 shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
            Dashboard Error
          </h2>
          <p className="text-white mb-4">
            An error occurred while rendering the dashboard. Please check the console for details.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg text-left overflow-auto max-h-40">
            <p className="text-red-400 font-mono text-sm">{String(error)}</p>
          </div>
        </div>
      </div>
    );
  }
}