"use client";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";

import { useRouter } from "next/navigation";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  try {
    return (
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">CRM</h1>
        <div className="relative" ref={dropdownRef}>
          {/* Click only on the user icon to open dropdown */}
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <FaUserCircle className="text-3xl text-gray-600" />
            <span className="text-gray-700 font-medium">Account</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 text-gray-600 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-lg border border-gray-200 z-[999]">
              {/* Arrow Indicator */}
              <div className="absolute -top-2 right-5 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200"></div>

              {/* User Info */}
              <div className="p-4 border-b text-center">
                <p className="font-semibold text-gray-800">Hi, Guest</p>
                <p className="text-sm text-gray-500">User</p>
              </div>

              {/* Menu Items */}
              <ul className="py-2">
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <FaUser className="mr-2 text-gray-600" />
                  My Profile
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <FaCog className="mr-2 text-gray-600" />
                  Account Settings
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <FaQuestionCircle className="mr-2 text-gray-600" />
                  Need Help?
                </li>
                <li 
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    localStorage.removeItem("userrole");
    router.push("/login");
  }} 
  className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100 border-t"
>
  <FaSignOutAlt className="mr-2 text-red-500" />
  <span className="text-red-500">Sign Out</span>
</li>

              </ul>
            </div>
          )}
        </div>
      </header>
    );
  }
  catch (e) {
    console.log(e);
    return <></>
  }
}

export default Header;