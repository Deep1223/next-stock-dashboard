"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="bg-white w-full shadow-md">
      <div className="container w-full mx-auto px-6 py-4 flex justify-between items-center">
        {/* CRM Title */}
        <h1 className="text-xl font-bold text-blue-600">CRM</h1>

        {/* Centered Manage Leads Link */}
        <nav className="hidden md:flex justify-center flex-1">
          <Link href="/manageleads" className="text-gray-700 font-semibold hover:text-blue-500">
            Manage Leads
          </Link>
        </nav>
        <nav className="hidden md:flex justify-center flex-1">
          <Link href="/createuser" className="text-gray-700 font-semibold hover:text-blue-500">
            Create User
          </Link>
        </nav>

        {/* Logout Button (Right Side) */}
        <button 
          onClick={handleLogout} 
          className="hidden md:block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden bg-blue-100 text-center py-4 space-y-4 shadow-md">
          <Link href="/manageleads" className="block text-gray-700 font-semibold hover:text-blue-500">
            Manage Leads
          </Link>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
