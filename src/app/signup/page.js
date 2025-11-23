"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import IISMethods from "@/utils/IISMethods";
import Config from "@/config/config";
import ActionIcons from "@/components/ActionIcons";

export default function SignupPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const password = watch("userPassword");

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            if (data.userPassword !== data.confirmPassword) {
                IISMethods.errormsg("Passwords do not match", 1);
                return;
            }

            // Backend signup API
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.userEmail,
                    phone: data.phoneNumber,
                    password: data.userPassword,
                }),
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                IISMethods.errormsg(result.message || Config.signupFailederror, 1);
                return;
            }

            IISMethods.successmsg("Account created successfully", 2);
            router.push("/login");

        } catch (err) {
            console.error("Signup error", err);
            IISMethods.errormsg(Config.signupFailederror || "Signup failed", 1);

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left Side Image */}
            <div className="login-image-section">
                <Image
                    src="/stock-1.jpg"
                    alt="Signup Background"
                    fill
                    className="login-background-image"
                    priority
                />
            </div>

            {/* Right Side Form */}
            <div className="login-form-section">
                <div className="login-form-container">
                    <div className="login-header">
                        <h2 className="login-title">Create your account</h2>
                        <p className="login-subtitle">
                            Sign up to access your account and start using the dashboard.
                        </p>
                    </div>

                    <form
                        className="login-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        {/* FIRST + LAST NAME */}
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    {...register("firstName", { required: "First name is required" })}
                                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                                    placeholder="First name"
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    {...register("lastName", { required: "Last name is required" })}
                                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                                    placeholder="Last name"
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="form-group">
                            <input
                                type="email"
                                {...register("userEmail", { required: "Email is required" })}
                                className={`form-input ${errors.userEmail ? 'error' : ''}`}
                                placeholder="Email address"
                            />
                        </div>

                        {/* PHONE */}
                        <div className="form-group">
                            <input
                                type="tel"
                                {...register("phoneNumber", { required: "Phone number is required" })}
                                className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                                placeholder="Phone number"
                            />
                        </div>

                        {/* PASSWORD + CONFIRM */}
                        <div className="form-row">

                            <div className="form-group password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("userPassword", {
                                        required: "Password is required",
                                        minLength: { value: 8, message: "Min 8 characters" },
                                    })}
                                    className={`form-input ${errors.userPassword ? 'error' : ''}`}
                                    placeholder="Create password"
                                />

                                <span
                                    className="eye-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <ActionIcons type="eye-slash" /> : <ActionIcons type="eye" />}
                                </span>
                            </div>

                            <div className="form-group password-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword", {
                                        required: "Confirm password",
                                        validate: (value) =>
                                            value === password || "Passwords do not match",
                                    })}
                                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Confirm password"
                                />

                                <span
                                    className="eye-icon"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <ActionIcons type="eye-slash" /> : <ActionIcons type="eye" />}
                                </span>
                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`login-button ${isSubmitting ? "loading" : ""}`}
                            onClick={(e) => {
                                // Check if there are validation errors
                                if (Object.keys(errors).length > 0) {
                                    e.preventDefault();
                                    const firstError = Object.values(errors)[0];
                                    IISMethods.errormsg(firstError.message, 1);
                                }
                            }}
                        >
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </button>

                        <div className="signup-link">
                            <span>Already have an account?</span>
                            <button
                                type="button"
                                className="signup-button"
                                onClick={() => router.push("/login")}
                            >
                                Sign in
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}