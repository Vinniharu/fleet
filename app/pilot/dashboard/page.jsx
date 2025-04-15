"use client";

import { useState, useEffect } from "react";
import PilotDashboard from "@/app/components/pilot/PilotDashboard";
import { useAuth } from "@/app/context/AuthContext";
import { Plane, Wind, Cloud, Battery, Shield, AlertTriangle } from "lucide-react";

export default function PilotDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    flightHours: 0,
    completedMissions: 0,
    upcomingMissions: 0,
    droneHealth: 0,
    batteryLevel: 0,
  });

  const [weather, setWeather] = useState({
    temperature: 0,
    windSpeed: 0,
    visibility: 0,
    conditions: "",
  });

  // Simulate fetching data
  useEffect(() => {
    // In a real app, these would be API calls
    setStats({
      flightHours: 156.5,
      completedMissions: 42,
      upcomingMissions: 3,
      droneHealth: 85,
      batteryLevel: 75,
    });

    setWeather({
      temperature: 22.5,
      windSpeed: 12.8,
      visibility: 8.5,
      conditions: "Partly Cloudy",
    });
  }, []);

  return (
    <PilotDashboard>
      <div className="p-6 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-500">Pilot Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.username || "Pilot"}</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Flight Stats */}
          <div className="bg-gray-900 p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Plane className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-lg font-semibold text-white">Flight Stats</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Flight Hours</span>
                <span className="text-white font-medium">{stats.flightHours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Completed Missions</span>
                <span className="text-white font-medium">{stats.completedMissions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Upcoming Missions</span>
                <span className="text-white font-medium">{stats.upcomingMissions}</span>
              </div>
            </div>
          </div>

          {/* Weather Conditions */}
          <div className="bg-gray-900 p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Cloud className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-lg font-semibold text-white">Weather Conditions</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Temperature</span>
                <span className="text-white font-medium">{weather.temperature}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Wind Speed</span>
                <span className="text-white font-medium">{weather.windSpeed} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Visibility</span>
                <span className="text-white font-medium">{weather.visibility} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Conditions</span>
                <span className="text-white font-medium">{weather.conditions}</span>
              </div>
            </div>
          </div>

          {/* Drone Status */}
          <div className="bg-gray-900 p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Battery className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-lg font-semibold text-white">Drone Status</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Battery Level</span>
                  <span className="text-white font-medium">{stats.batteryLevel}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      stats.batteryLevel > 70 ? 'bg-green-500' : 
                      stats.batteryLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${stats.batteryLevel}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Drone Health</span>
                  <span className="text-white font-medium">{stats.droneHealth}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      stats.droneHealth > 70 ? 'bg-green-500' : 
                      stats.droneHealth > 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${stats.droneHealth}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Safety */}
          <div className="bg-gray-900 p-5 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-lg font-semibold text-white">Flight Safety</h2>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center text-green-500 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Pre-flight checks completed</span>
              </div>
              <div className="flex items-center text-green-500 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Route clearance confirmed</span>
              </div>
              <div className="flex items-center text-yellow-500">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>Weather monitoring advised</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-900 p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Mission</th>
                  <th scope="col" className="px-6 py-3">Duration</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="px-6 py-4">Apr 14, 2025</td>
                  <td className="px-6 py-4">Aerial Survey - Site Alpha</td>
                  <td className="px-6 py-4">1h 25m</td>
                  <td className="px-6 py-4"><span className="bg-green-900 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded">Completed</span></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="px-6 py-4">Apr 12, 2025</td>
                  <td className="px-6 py-4">Mapping - Rural Zone</td>
                  <td className="px-6 py-4">2h 10m</td>
                  <td className="px-6 py-4"><span className="bg-green-900 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded">Completed</span></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="px-6 py-4">Apr 10, 2025</td>
                  <td className="px-6 py-4">Infrastructure Inspection</td>
                  <td className="px-6 py-4">0h 45m</td>
                  <td className="px-6 py-4"><span className="bg-green-900 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PilotDashboard>
  );
} 