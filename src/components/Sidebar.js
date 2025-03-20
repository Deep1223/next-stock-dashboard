'use client';

import { useState } from "react";
import Link from "next/link";
import { FaHome, FaCog, FaUser, FaBars, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiSidebar } from "react-icons/fi";
import { FaClipboardList, FaTasks, FaUserTie } from "react-icons/fa";

// Example Usage:
// <FaClipboardList />
// <FaTasks />
// <FaUserTie />

const Sidebar = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isConfigOpen, setIsConfigOpen] = useState(false); // Dropdown state for Configuration

    return (
        <aside
            className={`bg-white p-5 shadow-md transition-all fixed h-full z-[2] ${props.isFixed ? "w-[240px]" : isOpen ? "w-[240px]" : "w-16"
                }`}
            onMouseEnter={() => !props.isFixed && setIsOpen(true)}
            onMouseLeave={() => {
                if (!props.isFixed) {
                    setIsOpen(false);
                    setIsConfigOpen(false); // Close dropdown when sidebar collapses
                }
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FaBars size={24} className="cursor-pointer" />
                    <h2
                        className={`text-xl font-bold transition-all ${isOpen || props.isFixed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                            }`}
                    >
                        CRM
                    </h2>
                </div>
                {(isOpen || props.isFixed) && (
                    <FiSidebar size={24} className="cursor-pointer ml-auto" onClick={() => props.setIsFixed(!props.isFixed)} />
                )}
            </div>

            {/* Sidebar Navigation with Links */}
            <nav className="mt-5">
                <ul>
                    <li className="flex items-center gap-3 py-2 cursor-pointer">
                        <span className="w-6 flex justify-center"><FaHome /></span>
                        <Link href="/dashboard" className={`transition-all ${isOpen || props.isFixed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}>
                            Home
                        </Link>
                    </li>

                    {/* Configuration Menu with Dropdown */}
                    <li className="cursor-pointer">
                        <div className="flex items-center gap-3 py-2" onClick={() => setIsConfigOpen(!isConfigOpen)}>
                            <span className="w-6 flex justify-center"><FaCog /></span>
                            <span className={`transition-all ${isOpen || props.isFixed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}>
                                Configuration
                            </span>
                            {isConfigOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
                        </div>

                        {/* Dropdown Items */}
                        {isConfigOpen && (
                            <ul className="pl-8 transition-all">
                                <li className="py-2">
                                    <Link href="/settings" className="text-gray-700 hover:text-black">
                                        Settings
                                    </Link>
                                </li>
                                <li className="py-2">
                                    <Link href="/configuration/field" className="text-gray-700 hover:text-black">
                                        Fields
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="flex items-center gap-3 py-2 cursor-pointer">
                        <span className="w-6 flex justify-center"><FaUser /></span>
                        <Link href="/users" className={`transition-all ${isOpen || props.isFixed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}>
                            Users
                        </Link>
                    </li>
                    <li className="flex items-center gap-3 py-2 cursor-pointer">
                        <span className="w-6 flex justify-center"><FaClipboardList /></span>
                        <Link href="/manageleads" className={`transition-all ${isOpen || props.isFixed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}>
                            manageleads
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
