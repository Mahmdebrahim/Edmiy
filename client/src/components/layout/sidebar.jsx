// src/components/educator/EducatorSidebar.jsx
import { NavLink } from "react-router-dom";
import { LayoutDashboardIcon, SquarePlus, Album } from "lucide-react";
const EducatorSidebar = () => {
    const sidebarLinks = [
      {
        name: "Dashboard",
        path: "/educator/dashboard", // أو "/" لو عايز الـ index يبقى dashboard
        icon: <LayoutDashboardIcon className="w-6 h-6" />,
      },
      {
        name: "Add Course",
        path: "/educator/add-course",
        icon: <SquarePlus className="w-6 h-6" />,
      },
      {
        name: "My Courses",
        path: "/educator/my-courses", // لو الـ chat فعلاً تحت /educator
        icon: <Album className="w-6 h-6" />,
      },
      // ممكن تضيف هنا items زيادة لاحقًا
      // { name: "Students", path: "/educator/students", icon: ... },
      // { name: "Settings", path: "/educator/settings", icon: ... },
    ];
  return (
    <aside
      className={`
            bg-white border-r border-gray-200 
            w-16 md:w-64 
            flex flex-col 
            transition-all duration-300
            md:pl-6
          `}
    >
      <nav className="flex-1 pt-6">
        {sidebarLinks.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-gray-700 transition-colors
                   hover:bg-blue-50 hover:text-blue-700
                   ${
                     isActive
                       ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-medium"
                       : ""
                   }`
            }
            end={item.path === "/educator"} // مهم لو عندك index route
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="hidden md:block">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default EducatorSidebar;
