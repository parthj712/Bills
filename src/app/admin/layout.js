import Sidebar from "@/Componenets/AdminScreens/Sidebar/Sidebar";
import AdminGuard from "./AdminGuard";

export default async function AdminLayout({ children }) {
  // sidebar should be here

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </AdminGuard>
  );
}
