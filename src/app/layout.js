// src/app/layout.js
'use client'

import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import "../styles/globals.css";
import "../styles/styles.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer } from 'react-toastify';

const Layout = ({ children }) => {
  const [isFixed, setIsFixed] = useState(false);

  try {
    return (
      <html lang="en">
        <body className="flex h-screen bg-gray-100">
          <ToastContainer />
          <Sidebar isFixed={isFixed} setIsFixed={setIsFixed} />
          <div className={`flex flex-col transition-all ${isFixed ? "ml-[240px]" : "ml-16"} flex-1 w-100`}>
            <Header />
            <main className="p-4 flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </body>
      </html>
    );
  }
  catch (e) {
    console.error(e);
    return <></>;
  }
}

export default Layout;