import DataSidebar from "./DataSidebar";

export default function DataDashboard({ children }) {
  return (
    <div className="flex">
      <DataSidebar />
      <div className="flex-1 h-screen overflow-auto bg-black">{children}</div>
    </div>
  );
}
