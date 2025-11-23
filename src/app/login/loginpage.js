"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SignupModal from "../../components/SignupModal";
import IISMethods from "@/utils/IISMethods";
import Config from "@/config/config";
import ActionIcons from "@/components/ActionIcons";
import { setLoginInfo } from "@/utils/reduxUtils";

export default function LoginPage() {
    const router = useRouter();
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({ mode: "onChange" });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Backend login API call
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.userEmail,
                    password: data.userPassword,
                }),
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                IISMethods.errormsg(result.message || Config.invalidCredentialserror, 1);
                return;
            }

            const user = result.user; // { id, firstName, lastName, email, phone }
            setLoginInfo(user);

            IISMethods.successmsg("Login successful", 2);

            // Redirect to dashboard
            router.push("/dashboard");

        } catch (error) {
            console.error("Login error:", error);
            IISMethods.errormsg(Config.loginFailederror, 1);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left Side - Image Section */}
            <div className="login-image-section">
                <Image
                    src="/stock-1.jpg"
                    alt="Login Background"
                    fill
                    className="login-background-image"
                    priority
                />
            </div>

            {/* Right Side - Login Form Section */}
            <div className="login-form-section">
                <div className="login-form-container">
                    <div className="login-header">
                        <h2 className="login-title">Sign in to your account</h2>
                        <p className="login-subtitle">
                            Welcome back! Please enter your login details below to access your account.
                        </p>
                    </div>

                    <form 
                        className="login-form" 
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (Object.keys(errors).length > 0) {
                                const firstError = Object.values(errors)[0];
                                IISMethods.errormsg(firstError.message, 1);
                                return;
                            }
                            handleSubmit(onSubmit)(e);
                        }}
                    >
                        {/* EMAIL */}
                        <div className="form-group">
                            <input
                                id="email"
                                type="email"
                                {...register("userEmail", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className={`form-input ${errors.userEmail ? 'error' : ''}`}
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="form-group password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("userPassword", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                })}
                                className={`form-input ${errors.userPassword ? 'error' : ''}`}
                                placeholder="Enter your password"
                            />
                            <span
                                className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <ActionIcons type="eye-slash" />
                                ) : (
                                    <ActionIcons type="eye" />
                                )}
                            </span>
                        </div>

                        <div className="form-options">
                            <div className="remember-me">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="checkbox-input"
                                />
                                <label htmlFor="remember-me" className="checkbox-label">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="forgot-password">
                                Forgot your password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`login-button ${isSubmitting ? "loading" : ""}`}
                        >
                            {isSubmitting ? (
                                <span className="button-content">
                                    <svg className="spinner" viewBox="0 0 24 24">
                                        <circle
                                            className="spinner-circle"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="spinner-path"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign in"
                            )}
                        </button>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <button type="button" className="google-button">
                            <svg className="google-icon" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Sign in with Google
                        </button>

                        <div className="signup-link">
                            <span>Don't have an account?</span>
                            <button
                                type="button"
                                className="signup-button"
                                onClick={() => router.push("/signup")}
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Signup Modal */}
            <SignupModal
                isOpen={isSignupModalOpen}
                onClose={() => setIsSignupModalOpen(false)}
            />
        </div>
    );
}