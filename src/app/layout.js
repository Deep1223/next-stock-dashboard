"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import "react-toastify/dist/ReactToastify.css";
import "rsuite/dist/rsuite.min.css";
import "../styles/globals.css";
import "../styles/styles.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ClientOnly from "../components/ClientOnly";
import { ToastContainer, toast } from "react-toastify";

const AUTO_LOGOUT_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const Layout = ({ children }) => {
  const [isFixed, setIsFixed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage =
    pathname === "/login" || pathname === "/" || pathname === "/signup";

  // Bootstrap JS
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  // 🔁 Auto logout without localStorage
  useEffect(() => {
    if (isAuthPage) return;

    // sirf memory me lastActivity track karenge
    let lastActivity = Date.now();

    const resetSession = () => {
      lastActivity = Date.now();
    };

    const checkAutoLogout = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivity > AUTO_LOGOUT_TIME) {
        toast.warning("Session expired. Logging out...");
        router.push("/login");
      }
    };

    // user activity listeners
    window.addEventListener("mousemove", resetSession);
    window.addEventListener("keydown", resetSession);
    window.addEventListener("click", resetSession);

    // har 1 min me check
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
      <head suppressHydrationWarning>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
        />
      </head>
      <body className="d-flex vh-100">
        <Provider store={store}>
          <ClientOnly>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              limit={5}
            />
          </ClientOnly>

          {!isAuthPage && (
            <Sidebar isFixed={isFixed} setIsFixed={setIsFixed} />
          )}

          <div
            className={`d-flex flex-column main-content-transition main-content-wrapper ${!isAuthPage && isFixed
                ? "main-content-expanded"
                : "main-content-collapsed"
              } ${isAuthPage ? "ml-unset" : ""}`}
          >
            {!isAuthPage && <Header />}

            <main className={`flex-grow-1 ${isAuthPage ? "" : "p-4"}`}>
              {children}
            </main>

            {!isAuthPage && <Footer />}
          </div>
        </Provider>
      </body>
    </html>
  );
};

export default Layout;
