"use client";

import { useForm } from "react-hook-form";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        if (typeof window !== "undefined") { // Ensure it's running on the client
          const storedToken = localStorage.getItem("token");
          const storedUserId = localStorage.getItem("userid");
          const storedUserRole = localStorage.getItem("userrole");
      
          setToken(storedToken);
          setUserId(storedUserId);
          setUserRole(storedUserRole);
      
          // Auto-navigate based on role
          if (storedUserRole === "Administrator") {
            router.push("/dashboard");
          } else if (storedUserRole === "Sales User") {
            router.push("/sales-dashboard");
          }
        }
      }, []);
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("https://dev.crmbackend.finnovationz.com/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log(result)
            localStorage.setItem('userrole',result.user.userRole)
            localStorage.setItem('token',result.token)
            localStorage.setItem('userId',result.user.userid)


            if (response.ok) {
                if (result.user.userRole === "Administrator") {
                    router.push("/dashboard");
                } else if (result.user.userRole === "sales user") {
                    router.push("/sales-dashboard");
                } else {
                    alert("Unauthorized role");
                }
            } else {
                alert(result.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="md:w-[400px] w-[300px] -ml-16 bg-white rounded-2xl shadow-2xl md:p-8 p-3 space-y-8 transform transition duration-300 ease-in-out border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Sign in to your account
                    </h2>
                  
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-md font-medium text-gray-700">Email address</label>
                            <input id="email" type="email" {...register("userEmail", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" } })} className={`mt-1 w-full px-4 py-3 border ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 placeholder-gray-400 text-gray-900`} placeholder="Enter your email" />
                            {errors.email && <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-md font-medium text-gray-700">Password</label>
                            <input id="password" type="password" {...register("userPassword", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })} className={`mt-1 w-full px-4 py-3 border ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 placeholder-gray-400 text-gray-900`} placeholder="Enter your password" />
                            {errors.password && <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.password.message}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition duration-200" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 hover:text-indigo-600 cursor-pointer transition duration-200">Remember me</label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-800 transition duration-200 underline underline-offset-2 hover:underline-offset-4">Forgot your password?</a>
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={isSubmitting} className={`w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-sm font-medium text-white ${isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 transform hover:scale-105`}>
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
