import AdminDashboard from "@/app/components/admin/AdminDashboard";
import CreateUserForm from "@/app/components/admin/CreateUserForm";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";

export default function CreateUser() {
  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <AdminDashboard>
        <div className="flex justify-center items-center h-full">
        <CreateUserForm />
        </div>
      </AdminDashboard>
    </ProtectedRoute>
  );
}
