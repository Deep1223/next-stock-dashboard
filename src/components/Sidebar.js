'use client';

import { useState,useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Correct Hook
import { FaHome, FaCog, FaUser, FaBars, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiSidebar } from "react-icons/fi";
import { FaClipboardList } from "react-icons/fa";

const Sidebar = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isConfigOpen, setIsConfigOpen] = useState(false); // Dropdown state for Configuration
    const pathname = usePathname(); // ✅ Get Current Path
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [users, setUsers] = useState([]);
    useEffect(() => {
      if (typeof window !== "undefined") { // Ensure it's running on the client
        setToken(localStorage.getItem('token'));
        setUserId(localStorage.getItem('userid'));
        setUserRole(localStorage.getItem('userrole'));
      }
    }, []);
    // Active Route Function
    const isActive = (path) => pathname === path;

    return (
        <aside
            className={`bg-gray-100 p-5 shadow-md transition-all fixed h-screen z-[10] flex flex-col ${
                props.isFixed ? "w-[240px]" : isOpen ? "w-[240px]" : "w-16"
            }`}
            onMouseEnter={() => {
                if (!props.isFixed) {
                    setIsOpen(true);
                }
            }}
            onMouseLeave={() => {
                if (!props.isFixed) {
                    setIsOpen(false);
                    setIsConfigOpen(false); // Close dropdown when sidebar collapses
                }
            }}
        >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FaBars size={24} className="cursor-pointer hover:bg-gray-300 p-1 rounded-md" />
                    <h2
                        className={`text-xl font-bold transition-all overflow-hidden whitespace-nowrap ${
                            isOpen || props.isFixed ? "opacity-100 translate-x-0 w-auto" : "opacity-0 -translate-x-5 w-0"
                        }`}
                    >
                        CRM
                    </h2>
                </div>
                {(isOpen || props.isFixed) && (
                    <FiSidebar size={24} className="cursor-pointer hover:bg-gray-300 p-1 rounded-md ml-auto" 
                        onClick={() => props.setIsFixed(!props.isFixed)} 
                    />
                )}
            </div>

            {/* Sidebar Navigation with Links */}
            <nav className="mt-5 flex-grow">
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard" 
                            className={`flex items-center gap-3 py-2 px-2 rounded-md transition ${
                                isActive("/dashboard") ? "bg-gray-300 text-black" : "hover:bg-gray-200"
                            }`}
                        >
                            <span className="w-6 flex justify-center"><FaHome /></span>
                            <span className={`transition-all whitespace-nowrap overflow-hidden ${
                                isOpen || props.isFixed ? "opacity-100 translate-x-0 w-auto" : "opacity-0 -translate-x-5 w-0"
                            }`}>
                                Home
                            </span>
                        </Link>
                    </li>

                    {/* Configuration Menu with Dropdown */}
                    <li className="relative">
                        <div 
                            className={`flex items-center gap-3 py-2 px-2 rounded-md cursor-pointer transition ${
                                isActive("/settings") || isActive("/configuration/field") ? "bg-gray-300 text-black" : "hover:bg-gray-200"
                            }`}
                            onClick={() => setIsConfigOpen(!isConfigOpen)}
                        >
                            <span className="w-6 flex justify-center"><FaCog /></span>
                            <span className={`transition-all whitespace-nowrap overflow-hidden ${
                                isOpen || props.isFixed ? "opacity-100 translate-x-0 w-auto" : "opacity-0 -translate-x-5 w-0"
                            }`}>
                                Configuration
                            </span>
                            {isConfigOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
                        </div>

                        {/* Dropdown Items (Inside Sidebar) */}
                        {isConfigOpen && (
                            <ul className={`pl-6 transition-all ${isOpen || props.isFixed ? "block" : "hidden"}`}>
                                <li>
                                    <Link href="/settings"
                                        className={`block py-2 px-2 rounded-md transition ${
                                            isActive("/settings") ? "bg-gray-300 text-black" : "hover:bg-gray-200"
                                        }`}
                                    >
                                        Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/configuration/field"
                                        className={`block py-2 px-2 rounded-md transition ${
                                            isActive("/configuration/field") ? "bg-gray-300 text-black" : "hover:bg-gray-200"
                                        }`}
                                    >
                                        Fields
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {userRole === "Administrator" && (
  <li>
    <Link href="/users" 
      className={`flex items-center gap-3 py-2 px-2 rounded-md transition ${
        isActive("/users") ? "bg-gray-300 text-black" : "hover:bg-gray-200"
      }`}
    >
      <span className="w-6 flex justify-center"><FaUser /></span>
      <span className={`transition-all whitespace-nowrap overflow-hidden ${
        isOpen || props.isFixed ? "opacity-100 translate-x-0 w-auto" : "opacity-0 -translate-x-5 w-0"
      }`}>
        Users
      </span>
    </Link>
  </li>
)}

                    <li>
                        <Link href="/manageleads" 
                            className={`flex items-center gap-3 py-2 px-2 rounded-md transition ${
                                isActive("/manageleads") ? "bg-gray-300 text-black" : "hover:bg-gray-200"
                            }`}
                        >
                            <span className="w-6 flex justify-center"><FaClipboardList /></span>
                            <span className={`transition-all whitespace-nowrap overflow-hidden ${
                                isOpen || props.isFixed ? "opacity-100 translate-x-0 w-auto" : "opacity-0 -translate-x-5 w-0"
                            }`}>
                                Manage Leads
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
