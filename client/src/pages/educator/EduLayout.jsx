import { NavLink, Outlet } from "react-router-dom";
import EducatorNavbar from "../../components/educator/EducatorNavbar";
import { LayoutDashboardIcon, SquarePlus, Album } from "lucide-react";
import EducatorSidebar from "../../components/layout/sidebar";
import EduFooter from "../../components/layout/EduFooter";

const EduLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <EducatorNavbar />

      {/* Main area with sidebar + content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <EducatorSidebar />

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 bg-white overflow-auto">
          <Outlet />
        </main>
      </div>
        <EduFooter/>
    </div>
  );
};

export default EduLayout;
