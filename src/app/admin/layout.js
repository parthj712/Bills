import Sidebar from "@/Componenets/AdminScreens/Sidebar/Sidebar";
import MobileNav from "@/Componenets/AdminScreens/Sidebar/MobileNav";
import AdminGuard from "./AdminGuard";

export default async function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Section */}
        <div className="flex-1 flex flex-col">
          {/* ✅ Mobile Top Bar */}
          <MobileNav />

          {/* Page Content */}
          <main
            className="
          lg:ml-64 md:m-4 m-3
          flex-1
          overflow-y-auto
          bg-[#f9fafb]
          p-2
        "
          >
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
