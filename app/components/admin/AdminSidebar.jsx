"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  ClipboardList,
  Plane,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const AdminSidebarLinks = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Create User",
      href: "/admin/create-user",
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      label: "Manage Users",
      href: "/admin/manage-users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "View Flight Logs",
      href: "/admin/view-flight-logs",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      label: "Add Drone",
      href: "/admin/add-drone",
      icon: <Plane className="w-5 h-5" />,
    },
    {
      label: "Manage Drones",
      href: "/admin/manage-drones",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-gray-800 text-yellow-500"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 
        fixed 
        md:relative 
        z-10 
        ${isCollapsed ? "w-16" : "w-64"} 
        h-screen 
        bg-gray-900 
        transition-all 
        duration-300 
        ease-in-out 
        shadow-lg
        flex
        flex-col
      `}
      >
        <div className="p-4 flex items-center justify-center md:justify-start overflow-hidden">
          <img src="/images/icon.webp" alt="Briech Logo" className="w-8 h-8" />
          {!isCollapsed && (
            <h2 className="ml-3 text-xl font-bold text-yellow-500 text-nowrap whitespace-nowrap">
              Briech UAS
            </h2>
          )}
        </div>

        <button
          onClick={toggleCollapse}
          className="hidden md:flex absolute -right-3 top-20 bg-gray-800 text-yellow-500 p-1 rounded-full border border-gray-700"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="px-4 overflow-hidden flex-grow">
          <div className="flex items-center justify-center h-10">
            {!isCollapsed && (
              <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider text-nowrap whitespace-nowrap">
                Admin Panel
              </h3>
            )}
          </div>
          <nav className="flex flex-col space-y-2">
            {AdminSidebarLinks.map((link, index) => {
              const isActive =
                pathname === link.href ||
                (link.href === "/admin/dashboard" &&
                  pathname === "/admin/dashboard");

              return (
                <Link
                  key={index}
                  href={link.href}
                  className={`
                    flex items-center 
                    ${isCollapsed ? "justify-center" : "px-4"} 
                    py-2 
                    ${
                      isActive
                        ? "bg-gray-800 text-yellow-500 font-medium"
                        : "text-gray-300 hover:bg-gray-800 hover:text-yellow-500"
                    } 
                    rounded-md 
                    transition-colors 
                    duration-200
                    text-nowrap
                    whitespace-nowrap
                  `}
                  title={isCollapsed ? link.label : ""}
                >
                  <div className={isCollapsed ? "" : "mr-3"}>{link.icon}</div>
                  {!isCollapsed && <span>{link.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-gray-800 mt-auto">
          <button
            onClick={handleLogout}
            className={`
              flex items-center 
              ${isCollapsed ? "justify-center" : "px-4"} 
              py-2 
              text-gray-300 hover:bg-gray-800 hover:text-red-400
              rounded-md 
              transition-colors 
              duration-200
              text-nowrap
              whitespace-nowrap
              w-full
            `}
            title={isCollapsed ? "Logout" : ""}
          >
            <div className={isCollapsed ? "" : "mr-3"}>
              <LogOut className="w-5 h-5" />
            </div>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
