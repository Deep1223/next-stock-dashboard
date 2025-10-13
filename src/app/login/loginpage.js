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
    
            if (response.ok) {
                localStorage.setItem("userrole", result.user.userRole);
                localStorage.setItem("token", result.token);
                localStorage.setItem("userId", result.user.userid);
                localStorage.setItem("userEmail", result.user.userEmail);

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
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white py-5 px-4">
            <div className="col-md-4 col-12 bg-white rounded-custom-xl shadow-custom-xl p-5 border border-light">
                <div className="text-center">
                    <h2 className="h2 fw-bold text-dark text-gradient">
                        Sign in to your account
                    </h2>
                </div>

                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <div className="mb-4">
                            <label htmlFor="email" className="form-label fw-medium text-secondary">Email address</label>
                            <input 
                                id="email" 
                                type="email" 
                                {...register("userEmail", { required: "Email is required" })} 
                                className="form-control form-control-custom" 
                                placeholder="Enter your email" 
                            />
                            {errors.userEmail && <p className="mt-2 small text-danger">{errors.userEmail.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label fw-medium text-secondary">Password</label>
                            <input 
                                id="password" 
                                type="password" 
                                {...register("userPassword", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })} 
                                className="form-control form-control-custom" 
                                placeholder="Enter your password" 
                            />
                            {errors.userPassword && <p className="mt-2 small text-danger">{errors.userPassword.message}</p>}
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center">
                            <input 
                                id="remember-me" 
                                name="remember-me" 
                                type="checkbox" 
                                checked={rememberMe} 
                                onChange={(e) => setRememberMe(e.target.checked)} 
                                className="form-check-input me-2" 
                            />
                            <label htmlFor="remember-me" className="form-check-label small text-secondary cursor-pointer">Remember me</label>
                        </div>
                        <div className="small">
                            <a href="#" className="fw-medium text-primary text-decoration-underline">Forgot your password?</a>
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className={`w-100 d-flex justify-content-center py-3 px-4 border-0 rounded btn-gradient text-white fw-medium hover-scale
                                ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isSubmitting ? (
                                <span className="d-flex align-items-center">
                                    <svg className="spinner-border spinner-border-sm me-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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