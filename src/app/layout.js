'use client'

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';
import "../styles/globals.css";
import "../styles/styles.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer, toast } from 'react-toastify';

const AUTO_LOGOUT_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const Layout = ({ children }) => {
  const [isFixed, setIsFixed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const isAuthPage = pathname === "/login" || pathname === "/";

  const resetSession = () => {
    localStorage.setItem("lastActivity", Date.now().toString());
  };

  useEffect(() => {
    if (isAuthPage) return; 

    const checkAutoLogout = () => {
      const lastActivity = parseInt(localStorage.getItem("lastActivity") || "0", 10);
      const currentTime = Date.now();

      if (currentTime - lastActivity > AUTO_LOGOUT_TIME) {
        localStorage.removeItem("lastActivity"); // Clear session
        toast.warning("Session expired. Logging out...");
        router.push("/login"); // Redirect to login
      }
    };

    // Set initial session time on component mount
    resetSession();

    // Listen for user interactions to reset the session timer
    window.addEventListener("mousemove", resetSession);
    window.addEventListener("keydown", resetSession);
    window.addEventListener("click", resetSession);

    // Check auto logout every minute
    const interval = setInterval(checkAutoLogout, 60 * 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetSession);
      window.removeEventListener("keydown", resetSession);
      window.removeEventListener("click", resetSession);
    };
  }, [isAuthPage, router]);

  return (
    <html lang="en">
      <body className="flex h-screen">
        <ToastContainer />

        {/* Show Sidebar and Header for all modules except login & landing page */}
        {!isAuthPage && <Sidebar isFixed={isFixed} setIsFixed={setIsFixed} />}

        <div className={`flex flex-col transition-all ${!isAuthPage && isFixed ? "ml-[240px]" : "ml-16"} flex-1 w-full`}>
          {!isAuthPage && <Header />}

          <main className="p-4 flex-grow">
            {children}
          </main>

          {/* Hide Footer for login and landing page */}
          {!isAuthPage && <Footer />}
        </div>
      </body>
    </html>
  );
};

export default Layout;
