"use client";

import { useState, useEffect } from "react";
import PilotDashboard from "@/app/components/pilot/PilotDashboard";
import { useAuth } from "@/app/context/AuthContext";
import authService from "@/lib/authService";
import { Plane, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Power, Video, Camera, RotateCw } from "lucide-react";

export default function FlightControlsPage() {
  const { user } = useAuth();
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [drones, setDrones] = useState([]);
  const [flightStatus, setFlightStatus] = useState("Landed");
  const [altitude, setAltitude] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const data = await authService.getPilotControls();
        setDrones(data.drones || []);
        if (data.drones && data.drones.length > 0) {
          setSelectedDrone(data.drones[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching drones:", error);
        setLoading(false);
      }
    };

    fetchDrones();
  }, []);

  const handleTakeoff = () => {
    setFlightStatus("In Flight");
    setAltitude(10);
  };

  const handleLand = () => {
    setFlightStatus("Landing...");
    setTimeout(() => {
      setFlightStatus("Landed");
      setAltitude(0);
    }, 3000);
  };

  const handleAltitudeChange = (change) => {
    if (flightStatus === "In Flight") {
      setAltitude(Math.max(0, altitude + change));
    }
  };

  return (
    <PilotDashboard>
      <div className="p-6 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-500">Flight Controls</h1>
          <p className="text-gray-400 mt-1">Control your drone with precision</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Drone Selection */}
            <div className="bg-gray-900 p-5 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-white mb-4">Select Drone</h2>
              {drones.length === 0 ? (
                <p className="text-gray-400">No drones available</p>
              ) : (
                <div className="space-y-3">
                  {drones.map((drone) => (
                    <div
                      key={drone.id}
                      className={`
                        p-3 rounded-md cursor-pointer transition-colors
                        ${selectedDrone?.id === drone.id ? 'bg-gray-800 border border-yellow-500' : 'bg-gray-800 hover:bg-gray-700'}
                      `}
                      onClick={() => setSelectedDrone(drone)}
                    >
                      <div className="flex items-center">
                        <Plane className="h-5 w-5 text-yellow-500 mr-2" />
                        <div>
                          <p className="text-white font-medium">{drone.name}</p>
                          <p className="text-gray-400 text-sm">{drone.model}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <span className={`px-2 py-0.5 rounded ${drone.status === 'Ready' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'}`}>
                          {drone.status}
                        </span>
                        <span className="text-gray-400">Battery: {drone.batteryLevel}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Flight Controls */}
            <div className="bg-gray-900 p-5 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-white mb-4">Flight Controls</h2>
              
              {selectedDrone ? (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className="text-white font-medium">{flightStatus}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Altitude</p>
                      <p className="text-white font-medium">{altitude} m</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      className="col-start-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md p-3 flex justify-center"
                      onClick={() => handleAltitudeChange(5)}
                      disabled={flightStatus !== "In Flight"}
                    >
                      <ArrowUp className="h-6 w-6" />
                    </button>
                    <button
                      className="bg-gray-800 hover:bg-gray-700 text-white rounded-md p-3 flex justify-center"
                      disabled={flightStatus !== "In Flight"}
                    >
                      <ArrowLeft className="h-6 w-6" />
                    </button>
                    <button
                      className="bg-gray-800 hover:bg-gray-700 text-white rounded-md p-3 flex justify-center"
                      disabled={flightStatus !== "In Flight"}
                    >
                      <RotateCw className="h-6 w-6" />
                    </button>
                    <button
                      className="bg-gray-800 hover:bg-gray-700 text-white rounded-md p-3 flex justify-center"
                      disabled={flightStatus !== "In Flight"}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </button>
                    <button
                      className="col-start-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md p-3 flex justify-center"
                      onClick={() => handleAltitudeChange(-5)}
                      disabled={flightStatus !== "In Flight"}
                    >
                      <ArrowDown className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {flightStatus === "Landed" ? (
                      <button
                        className="bg-green-700 hover:bg-green-600 text-white rounded-md py-2 flex items-center justify-center"
                        onClick={handleTakeoff}
                      >
                        <Power className="h-5 w-5 mr-2" />
                        Take Off
                      </button>
                    ) : (
                      <button
                        className="bg-red-700 hover:bg-red-600 text-white rounded-md py-2 flex items-center justify-center"
                        onClick={handleLand}
                      >
                        <Power className="h-5 w-5 mr-2" />
                        Land
                      </button>
                    )}
                    <button
                      className="bg-blue-700 hover:bg-blue-600 text-white rounded-md py-2 flex items-center justify-center"
                      disabled={flightStatus !== "In Flight"}
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Capture
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Select a drone to control</p>
              )}
            </div>

            {/* Live View */}
            <div className="bg-gray-900 p-5 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Video className="h-5 w-5 mr-2 text-yellow-500" />
                Live Feed
              </h2>
              <div className="aspect-video bg-gray-800 rounded-md flex items-center justify-center mb-4">
                {flightStatus === "In Flight" ? (
                  <img 
                    src="/images/drone-view.jpg" 
                    alt="Drone Camera View" 
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = '<div class="text-gray-500 flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg><p>No video feed available</p></div>';
                    }}
                  />
                ) : (
                  <div className="text-gray-500 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>Video feed inactive</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-sm">Signal Strength</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Resolution</p>
                  <p className="text-white">1080p HD</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PilotDashboard>
  );
} 