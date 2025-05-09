"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DataDashboard from '@/app/components/data-engineer/DataDashboard';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import { TableSkeleton, StatsSkeleton } from '@/app/components/ui/SkeletonLoader';
import AdminDashboard from '@/app/components/admin/AdminDashboard';

const ViewFlightLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'flightTimestamp', direction: 'desc' });
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [flightLogs, setFlightLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFlightLogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://www.briechuas.com/flmgt/flight-logs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(sessionStorage.getItem('accessToken'))}`
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setFlightLogs(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching flight logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlightLogs();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Format timestamp to user-friendly display
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

  // Handle view details click
  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  // Close the detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedLog(null);
  };

  // Format flight time to display minutes
  const formatFlightTime = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    return `${minutes} min`;
  };

  // Filter and sort the flight logs
  const filteredAndSortedLogs = flightLogs
    .filter(log => {
      // Search filter
      const searchMatch = searchTerm === '' || 
        log.missionCoordinator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.aircraftName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.missionObjective.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(log.flightTimestamp).toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const statusMatch = statusFilter === '' || log.status === statusFilter;
      
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      // Sort by selected key
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const content = (
    <div className="container mx-auto px-4 py-8 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Flight Logs</h1>
      
      {/* Filters and search */}
      <div className="mb-6 bg-gray-900/70 p-4 rounded-xl border border-yellow-500/20 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="w-full md:w-1/2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search by coordinator, aircraft, objective..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={isLoading}
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={isLoading}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Aborted">Aborted</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/4 flex items-end">
            <button
              className="w-full bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
              disabled={isLoading}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Results summary */}
      {!isLoading && (
        <div className="mb-4">
          <p className="text-gray-400">
            Showing {filteredAndSortedLogs.length} of {flightLogs.length} flight logs
          </p>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <>
          <StatsSkeleton />
          <TableSkeleton columns={7} rows={5} />
        </>
      ) : (
        <>
          {/* Flight logs table */}
          <div className="bg-gray-900 rounded-lg overflow-hidden border border-yellow-500/20 shadow-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('flightTimestamp')}
                  >
                    Date/Time
                    {sortConfig.key === 'flightTimestamp' && (
                      <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('missionCoordinator')}
                  >
                    Coordinator
                    {sortConfig.key === 'missionCoordinator' && (
                      <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('aircraftName')}
                  >
                    Aircraft
                    {sortConfig.key === 'aircraftName' && (
                      <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('missionObjective')}
                  >
                    Mission Objective
                    {sortConfig.key === 'missionObjective' && (
                      <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    Status
                    {sortConfig.key === 'status' && (
                      <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('flightTimeMinutes')}
                  >
                    Flight Time
                    {sortConfig.key === 'flightTimeMinutes' && (
                      <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-900/70">
                {filteredAndSortedLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(log.flightTimestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {log.missionCoordinator}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {log.aircraftName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {log.missionObjective}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${log.status === 'Completed' ? 'bg-green-900 text-green-300' : 
                          log.status === 'In Progress' ? 'bg-yellow-900 text-yellow-300' : 
                          log.status === 'Aborted' ? 'bg-red-900 text-red-300' : 
                          'bg-yellow-900 text-yellow-300'}`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatFlightTime(log.flightTimeMinutes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-yellow-400 hover:text-yellow-300 m-auto"
                        onClick={() => handleViewDetails(log)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredAndSortedLogs.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-400">
                      No flight logs found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Create New Log Button */}
          <div className="mt-6">
            <Link href="/data-collection/create-flight-logs" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
              Create New Flight Log
            </Link>
          </div>
        </>
      )}
      
      {/* Flight Log Details Modal */}
      {isDetailModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto text-gray-200">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-yellow-400">
                Flight Log Details: {selectedLog.aircraftName}
              </h3>
              <button 
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-3 border-b pb-2 border-yellow-500 text-yellow-400">Basic Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Log Created:</span>
                      <span>{formatDate(selectedLog.logTimestamp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Flight Date/Time:</span>
                      <span>{formatDate(selectedLog.flightTimestamp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Mission Coordinator:</span>
                      <span>{selectedLog.missionCoordinator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Aircraft:</span>
                      <span>{selectedLog.aircraftName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                        ${selectedLog.status === 'Completed' ? 'bg-green-900 text-green-300' : 
                          selectedLog.status === 'In Progress' ? 'bg-yellow-900 text-yellow-300' : 
                          selectedLog.status === 'Aborted' ? 'bg-red-900 text-red-300' : 
                          'bg-yellow-900 text-yellow-300'}`}
                      >
                        {selectedLog.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Mission Objective:</span>
                      <span>{selectedLog.missionObjective}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Flight Time:</span>
                      <span>{formatFlightTime(selectedLog.flightTimeMinutes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Flight Distance:</span>
                      <span>{selectedLog.flightDistanceKm} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{selectedLog.flightMonth}/{selectedLog.flightYear}, Week {selectedLog.flightWeek}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium block mb-1">Description:</span>
                      <p className="text-sm text-gray-300 bg-gray-600 p-2 rounded border border-gray-700">
                        {selectedLog.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Weather & Environment */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-3 border-b pb-2 border-yellow-500 text-yellow-400">Weather & Environment</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Weather Conditions:</span>
                      <span>{selectedLog.weatherConditions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Wind Conditions:</span>
                      <span>{selectedLog.windConditions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Wind Speed:</span>
                      <span>{selectedLog.windSpeedMps} m/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Temperature:</span>
                      <span>{selectedLog.temperatureC}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Altitude:</span>
                      <span>{selectedLog.altitudeM} m</span>
                    </div>
                  </div>
                </div>
                
                {/* Technical Data */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-3 border-b pb-2 border-yellow-500 text-yellow-400">Battery Information</h4>
                  <div className="space-y-2">
                    {selectedLog.battery3sQty > 0 && (
                      <div className="bg-gray-600 p-2 rounded border border-gray-700 mb-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">3S Battery (Qty: {selectedLog.battery3sQty}):</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Takeoff: {selectedLog.batteryTakeoff3sV}V</span>
                          <span>Landing: {selectedLog.batteryLanding3sV}V</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedLog.battery7sQty > 0 && (
                      <div className="bg-gray-600 p-2 rounded border border-gray-700 mb-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">7S Battery (Qty: {selectedLog.battery7sQty}):</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Takeoff: {selectedLog.batteryTakeoff7sV}V</span>
                          <span>Landing: {selectedLog.batteryLanding7sV}V</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedLog.battery14sQty > 0 && (
                      <div className="bg-gray-600 p-2 rounded border border-gray-700 mb-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">14S Battery (Qty: {selectedLog.battery14sQty}):</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Takeoff: {selectedLog.batteryTakeoff14sV}V</span>
                          <span>Landing: {selectedLog.batteryLanding14sV}V</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="font-medium">Battery Health:</span>
                      <span>{selectedLog.batteryHealth}</span>
                    </div>
                  </div>
                </div>
                
                {/* Performance Data */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-3 border-b pb-2 border-yellow-500 text-yellow-400">Performance Data</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">System Health:</span>
                      <span>{selectedLog.systemHealthStatus}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium block mb-1">Comments:</span>
                      <p className="text-sm text-gray-300 bg-gray-600 p-2 rounded border border-gray-700">
                        {selectedLog.comment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ProtectedRoute>
      <AdminDashboard>{content}</AdminDashboard>
    </ProtectedRoute>
  );
};

export default ViewFlightLogs;
