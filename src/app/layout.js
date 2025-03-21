'use client'

import { useState } from "react";
import { usePathname } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';
import "../styles/globals.css";
import "../styles/styles.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer } from 'react-toastify';

const Layout = ({ children }) => {
  const [isFixed, setIsFixed] = useState(false);
  const pathname = usePathname();

  // Check if the current path is 'login'
  const isLoginPage = pathname.startsWith("/login");

  try {
    return (
      <html lang="en">
        <body className="flex h-screen">
          <ToastContainer />

          {/* Show Sidebar and Header for all modules except login */}
          {!isLoginPage && <Sidebar isFixed={isFixed} setIsFixed={setIsFixed} />}

          <div className={`flex flex-col transition-all ${!isLoginPage && isFixed ? "ml-[240px]" : "ml-16"} flex-1 w-full`}>
            {!isLoginPage && <Header />}

            <main className="p-4 flex-grow">
              {children}
            </main>

            {/* Hide Footer for login page */}
            {!isLoginPage && <Footer />}
          </div>
        </body>
      </html>
    );
  } catch (e) {
    console.error(e);
    return <></>;
  }
}

export default Layout;
