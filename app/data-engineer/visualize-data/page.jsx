"use client";

import { useState, useEffect } from "react";
import DataDashboard from "@/app/components/data-engineer/DataDashboard";
import BriechDashboard from "@/app/components/data-engineer/BriechDashboard";

export default function LogsDisplay() {
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
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching flight logs:', error);
          }
        };
    
        fetchFlightLogs();
      }, []);

    return (
        <DataDashboard>
            <BriechDashboard data={flightLogs} droneFlightData={flightLogs} isLoading={isLoading} />
        </DataDashboard>
    )
}
