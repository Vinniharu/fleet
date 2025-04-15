import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard({ children }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 h-screen overflow-auto bg-black p-4">{children}</div>
    </div>
  );
}
