import BriechDashboard from "@/app/components/data-engineer/BriechDashboard";
import DataDashboard from "@/app/components/data-engineer/DataDashboard";
import dummyFlightLogs from "@/lib/dummyFlightLogs";

export default function LogsDisplay() {
    return (
        <DataDashboard>
            <BriechDashboard droneFlightData={dummyFlightLogs} />
        </DataDashboard>
    )
}
