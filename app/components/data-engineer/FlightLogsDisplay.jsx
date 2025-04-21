"use client";

import { useState, useEffect } from "react";
import FlightLogsSkeleton, { GridSkeleton, TableSkeleton, StatsSkeleton } from "../ui/SkeletonLoader";

export default function FlightLogsDisplay() {
  const [flightLogs, setFlightLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [view, setView] = useState("grid"); // grid or list
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFlightLogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://www.briechuas.com/flmgt/flight-logs`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSON.parse(
                sessionStorage.getItem("accessToken")
              )}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setFlightLogs(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching flight logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlightLogs();
  }, []);

  // Format flight time minutes
  const formatFlightTime = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Filter and sort the logs
  const filteredAndSortedLogs = flightLogs
    .filter(
      (log) =>
        log.aircraftName.toLowerCase().includes(filter.toLowerCase()) ||
        log.missionCoordinator.toLowerCase().includes(filter.toLowerCase()) ||
        log.missionObjective.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.flightTimestamp);
      const dateB = new Date(b.flightTimestamp);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-400";
      case "Aborted":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case "Optimal":
      case "Nominal":
        return "text-green-400";
      case "Good":
        return "text-yellow-400";
      case "Fair":
        return "text-orange-400";
      case "Needs Maintenance":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with controls */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
            Flight Logs
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg">
            {/* Search */}
            <div className="w-full md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search flights..."
                  className="w-full px-4 py-2 bg-gray-950/50 border border-yellow-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  disabled={isLoading}
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Order */}
              <div className="flex items-center">
                <label className="text-sm text-yellow-500 mr-2">Sort:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-gray-950/50 border border-yellow-500/20 rounded-lg text-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  disabled={isLoading}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-950/50 rounded-lg border border-yellow-500/20 p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    view === "grid"
                      ? "bg-yellow-600 text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                  disabled={isLoading}
                >
                  Grid
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    view === "list"
                      ? "bg-yellow-600 text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                  disabled={isLoading}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton loader for stats */}
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/70 rounded-xl p-4 border border-yellow-500/20 shadow-lg">
              <h3 className="text-yellow-500 text-sm font-medium">
                Total Flights
              </h3>
              <p className="text-2xl font-bold">{flightLogs.length}</p>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4 border border-yellow-500/20 shadow-lg">
              <h3 className="text-yellow-500 text-sm font-medium">
                Completed Missions
              </h3>
              <p className="text-2xl font-bold">
                {flightLogs.filter((log) => log.status === "Completed").length}
              </p>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4 border border-yellow-500/20 shadow-lg">
              <h3 className="text-yellow-500 text-sm font-medium">
                Total Flight Time
              </h3>
              <p className="text-2xl font-bold">
                {(
                  flightLogs.reduce((acc, log) => {
                    return acc + (log.flightTimeMinutes || 0);
                  }, 0) / 60
                ).toFixed(2) + " hrs"}
              </p>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4 border border-yellow-500/20 shadow-lg">
              <h3 className="text-yellow-500 text-sm font-medium">
                Average Flight Distance
              </h3>
              <p className="text-2xl font-bold">
                {flightLogs.length ? 
                  (flightLogs.reduce((acc, log) => acc + (log.flightDistanceKm || 0), 0) / flightLogs.length).toFixed(1) 
                  : "0"} km
              </p>
            </div>
          </div>
        )}

        {/* Loading states */}
        {isLoading ? (
          view === "grid" ? <GridSkeleton /> : <TableSkeleton />
        ) : (
          <>
            {/* No results message */}
            {filteredAndSortedLogs.length === 0 && (
              <div className="bg-gray-900/70 p-8 rounded-xl text-center border border-yellow-500/20 shadow-lg">
                <p className="text-gray-400">
                  No flight logs match your search criteria.
                </p>
              </div>
            )}

            {/* Grid View */}
            {view === "grid" && filteredAndSortedLogs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedLogs.map((log, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      setSelectedLog(selectedLog === index ? null : index)
                    }
                    className={`bg-gray-900/70 rounded-xl p-5 border border-yellow-500/20 shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-yellow-500/10 ${
                      selectedLog === index ? "ring-2 ring-yellow-500" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white">
                        {log.aircraftName}
                      </h3>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(
                          log.status
                        )} bg-black/30`}
                      >
                        {log.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mb-4">
                      {formatDate(log.flightTimestamp)}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-yellow-500 text-sm font-medium mb-1">
                        Mission
                      </h4>
                      <p className="text-white">{log.missionObjective}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-yellow-500 text-sm font-medium mb-1">
                        Coordinator
                      </h4>
                      <p className="text-white">{log.missionCoordinator}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-yellow-500 text-sm font-medium mb-1">
                          Flight Time
                        </h4>
                        <p className="text-white">{formatFlightTime(log.flightTimeMinutes)}</p>
                      </div>
                      <div>
                        <h4 className="text-yellow-500 text-sm font-medium mb-1">
                          Distance
                        </h4>
                        <p className="text-white">{log.flightDistanceKm} km</p>
                      </div>
                    </div>

                    {selectedLog === index && (
                      <div className="mt-5 pt-5 border-t border-yellow-500/10">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-yellow-500 text-sm font-medium mb-1">
                              Altitude
                            </h4>
                            <p className="text-white">{log.altitudeM} m</p>
                          </div>
                          <div>
                            <h4 className="text-yellow-500 text-sm font-medium mb-1">
                              Wind Speed
                            </h4>
                            <p className="text-white">{log.windSpeedMps} m/s</p>
                          </div>
                          <div>
                            <h4 className="text-yellow-500 text-sm font-medium mb-1">
                              Weather
                            </h4>
                            <p className="text-white">{log.weatherConditions}</p>
                          </div>
                          <div>
                            <h4 className="text-yellow-500 text-sm font-medium mb-1">
                              Temperature
                            </h4>
                            <p className="text-white">{log.temperatureC}°C</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-yellow-500 text-sm font-medium mb-1">
                            System Health
                          </h4>
                          <p
                            className={`${getHealthStatusColor(
                              log.systemHealthStatus
                            )}`}
                          >
                            {log.systemHealthStatus}
                          </p>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-yellow-500 text-sm font-medium mb-1">
                            Battery Health
                          </h4>
                          <p
                            className={`${getHealthStatusColor(log.batteryHealth)}`}
                          >
                            {log.batteryHealth}
                          </p>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-yellow-500 text-sm font-medium mb-1">
                            Description
                          </h4>
                          <p className="text-white text-sm">{log.description}</p>
                        </div>

                        {log.comment && (
                          <div className="mb-4">
                            <h4 className="text-yellow-500 text-sm font-medium mb-1">
                              Comment
                            </h4>
                            <p className="text-white text-sm">{log.comment}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedLog !== index && (
                      <button className="mt-2 w-full text-center text-sm text-yellow-500 hover:text-yellow-400">
                        View Details
                      </button>
                    )}

                    {selectedLog === index && (
                      <button className="mt-2 w-full text-center text-sm text-yellow-500 hover:text-yellow-400">
                        Hide Details
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {view === "list" && filteredAndSortedLogs.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full bg-gray-900/70 rounded-xl border border-yellow-500/20 shadow-lg">
                  <thead>
                    <tr className="border-b border-yellow-500/20">
                      <th className="px-4 py-3 text-left text-yellow-500">Date</th>
                      <th className="px-4 py-3 text-left text-yellow-500">
                        Aircraft
                      </th>
                      <th className="px-4 py-3 text-left text-yellow-500">
                        Mission
                      </th>
                      <th className="px-4 py-3 text-left text-yellow-500">
                        Coordinator
                      </th>
                      <th className="px-4 py-3 text-left text-yellow-500">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left text-yellow-500">
                        Distance
                      </th>
                      <th className="px-4 py-3 text-left text-yellow-500">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-yellow-500">
                        Health
                      </th>
                      <th className="px-4 py-3 text-right text-yellow-500">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedLogs.map((log, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-800 hover:bg-black/30 cursor-pointer ${
                          selectedLog === index ? "bg-black/50" : ""
                        }`}
                        onClick={() =>
                          setSelectedLog(selectedLog === index ? null : index)
                        }
                      >
                        <td className="px-4 py-3 text-sm">
                          {formatDate(log.flightTimestamp)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {log.aircraftName}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {log.missionObjective}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {log.missionCoordinator}
                        </td>
                        <td className="px-4 py-3 text-sm">{formatFlightTime(log.flightTimeMinutes)}</td>
                        <td className="px-4 py-3 text-sm">
                          {log.flightDistanceKm} km
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                              log.status
                            )} bg-black/30`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`${getHealthStatusColor(
                              log.systemHealthStatus
                            )}`}
                          >
                            {log.systemHealthStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <button className="text-yellow-500 hover:text-yellow-400">
                            {selectedLog === index ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Detail Panel for List View */}
                {selectedLog !== null && filteredAndSortedLogs.length > 0 && (
                  <div className="mt-4 bg-gray-900/70 rounded-xl p-6 border border-yellow-500/20 shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-bold text-white">
                        Flight Details:{" "}
                        {filteredAndSortedLogs[selectedLog].aircraftName}
                      </h3>
                      <button
                        onClick={() => setSelectedLog(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Flight Info */}
                      <div>
                        <h4 className="text-yellow-500 text-sm font-medium mb-3">
                          Flight Information
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-gray-400 text-xs">
                              Log Created:
                            </span>
                            <p className="text-white">
                              {formatDate(
                                filteredAndSortedLogs[selectedLog].logTimestamp
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">
                              Flight Date & Time:
                            </span>
                            <p className="text-white">
                              {formatDate(
                                filteredAndSortedLogs[selectedLog].flightTimestamp
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">Mission:</span>
                            <p className="text-white">
                              {filteredAndSortedLogs[selectedLog].missionObjective}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">
                              Description:
                            </span>
                            <p className="text-white">
                              {filteredAndSortedLogs[selectedLog].description}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">Status:</span>
                            <p
                              className={`${getStatusColor(
                                filteredAndSortedLogs[selectedLog].status
                              )}`}
                            >
                              {filteredAndSortedLogs[selectedLog].status}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">
                              Flight Time:
                            </span>
                            <p className="text-white">
                              {formatFlightTime(filteredAndSortedLogs[selectedLog].flightTimeMinutes)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">Distance:</span>
                            <p className="text-white">
                              {filteredAndSortedLogs[selectedLog].flightDistanceKm}{" "}
                              km
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">Altitude:</span>
                            <p className="text-white">
                              {filteredAndSortedLogs[selectedLog].altitudeM} m
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Weather and Conditions */}
                      <div>
                        <h4 className="text-yellow-500 text-sm font-medium mb-3">
                          Conditions
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-gray-400 text-xs">Weather:</span>
                            <p className="text-white">
                              {filteredAndSortedLogs[selectedLog].weatherConditions}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">Wind:</span>
                            <p className="text-white">
                              {filteredAndSortedLogs[selectedLog].windConditions} (
                              {filteredAndSortedLogs[selectedLog].windSpeedMps} m/s)
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">
                              Temperature:
                            </span>
                            <p className="text-white">
                              {filteredAndSortedLogs[selectedLog].temperatureC}°C
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">
                              System Health:
                            </span>
                            <p
                              className={`${getHealthStatusColor(
                                filteredAndSortedLogs[selectedLog]
                                  .systemHealthStatus
                              )}`}
                            >
                              {
                                filteredAndSortedLogs[selectedLog]
                                  .systemHealthStatus
                              }
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">
                              Battery Health:
                            </span>
                            <p
                              className={`${getHealthStatusColor(
                                filteredAndSortedLogs[selectedLog].batteryHealth
                              )}`}
                            >
                              {filteredAndSortedLogs[selectedLog].batteryHealth}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs">
                              Flight Date:
                            </span>
                            <p className="text-white">
                              {filteredAndSortedLogs[selectedLog].flightMonth}/
                              {filteredAndSortedLogs[selectedLog].flightYear}, Week {filteredAndSortedLogs[selectedLog].flightWeek}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Battery Data */}
                      <div>
                        <h4 className="text-yellow-500 text-sm font-medium mb-3">
                          Technical Data
                        </h4>
                        <div className="space-y-2">
                          {filteredAndSortedLogs[selectedLog].battery3sQty > 0 && (
                            <div>
                              <span className="text-gray-400 text-xs">
                                3S Battery:
                              </span>
                              <p className="text-white">
                                {
                                  filteredAndSortedLogs[selectedLog]
                                    .batteryTakeoff3sV
                                }
                                V →{" "}
                                {
                                  filteredAndSortedLogs[selectedLog]
                                    .batteryLanding3sV
                                }
                                V ({filteredAndSortedLogs[selectedLog].battery3sQty}{" "}
                                units)
                              </p>
                            </div>
                          )}
                          {filteredAndSortedLogs[selectedLog].battery7sQty > 0 && (
                            <div>
                              <span className="text-gray-400 text-xs">
                                7S Battery:
                              </span>
                              <p className="text-white">
                                {
                                  filteredAndSortedLogs[selectedLog]
                                    .batteryTakeoff7sV
                                }
                                V →{" "}
                                {
                                  filteredAndSortedLogs[selectedLog]
                                    .batteryLanding7sV
                                }
                                V ({filteredAndSortedLogs[selectedLog].battery7sQty}{" "}
                                units)
                              </p>
                            </div>
                          )}
                          {filteredAndSortedLogs[selectedLog].battery14sQty > 0 && (
                            <div>
                              <span className="text-gray-400 text-xs">
                                14S Battery:
                              </span>
                              <p className="text-white">
                                {
                                  filteredAndSortedLogs[selectedLog]
                                    .batteryTakeoff14sV
                                }
                                V →{" "}
                                {
                                  filteredAndSortedLogs[selectedLog]
                                    .batteryLanding14sV
                                }
                                V (
                                {filteredAndSortedLogs[selectedLog].battery14sQty}{" "}
                                units)
                              </p>
                            </div>
                          )}
                          {filteredAndSortedLogs[selectedLog].comment && (
                            <div className="pt-3 mt-3 border-t border-yellow-500/10">
                              <span className="text-gray-400 text-xs">
                                Comment:
                              </span>
                              <p className="text-white">
                                {filteredAndSortedLogs[selectedLog].comment}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
