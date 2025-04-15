import PilotSidebar from "./PilotSidebar";

export default function PilotDashboard({ children }) {
  return (
    <div className="flex">
      <PilotSidebar />
      <div className="flex-1 h-screen overflow-auto bg-black">{children}</div>
    </div>
  );
} 