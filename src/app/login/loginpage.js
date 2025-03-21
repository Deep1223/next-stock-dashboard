"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") { // Ensure it's running on the client
            const storedEmail = localStorage.getItem("rememberedEmail");
            const storedPassword = localStorage.getItem("rememberedPassword");
            const storedRememberMe = localStorage.getItem("rememberMe") === "true";

            if (storedRememberMe) {
                setValue("userEmail", storedEmail || "");
                setValue("userPassword", storedPassword || "");
                setRememberMe(true);
            }
        }
    }, [setValue]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("https://dev.crmbackend.finnovationz.com/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
            console.log(result);
    
            if (response.ok) {
                localStorage.setItem("userrole", result.user.userRole);
                localStorage.setItem("token", result.token);
                localStorage.setItem("userId", result.user.userid);
                localStorage.setItem("lastActivity", Date.now().toString()); // Start session timer
    
                // Store credentials only if "Remember Me" is checked
                if (rememberMe) {
                    localStorage.setItem("rememberedEmail", data.userEmail);
                    localStorage.setItem("rememberedPassword", data.userPassword);
                    localStorage.setItem("rememberMe", "true");
                } else {
                    localStorage.removeItem("rememberedEmail");
                    localStorage.removeItem("rememberedPassword");
                    localStorage.removeItem("rememberMe");
                }
    
                // Redirect based on role
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
            <div className="md:w-[400px] w-[300px] -ml-16 bg-white rounded-2xl shadow-2xl md:p-8 p-3 space-y-8 border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Sign in to your account
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-md font-medium text-gray-700">Email address</label>
                            <input 
                                id="email" 
                                type="email" 
                                {...register("userEmail", { required: "Email is required" })} 
                                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 placeholder-gray-400 text-gray-900" 
                                placeholder="Enter your email" 
                            />
                            {errors.userEmail && <p className="mt-2 text-sm text-red-600">{errors.userEmail.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-md font-medium text-gray-700">Password</label>
                            <input 
                                id="password" 
                                type="password" 
                                {...register("userPassword", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })} 
                                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 placeholder-gray-400 text-gray-900" 
                                placeholder="Enter your password" 
                            />
                            {errors.userPassword && <p className="mt-2 text-sm text-red-600">{errors.userPassword.message}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input 
                                id="remember-me" 
                                name="remember-me" 
                                type="checkbox" 
                                checked={rememberMe} 
                                onChange={(e) => setRememberMe(e.target.checked)} 
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition duration-200" 
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">Remember me</label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-800 transition duration-200 underline">Forgot your password?</a>
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className={`w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-sm font-medium text-white 
                                ${isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"} 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 transform hover:scale-105`}
                        >
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
