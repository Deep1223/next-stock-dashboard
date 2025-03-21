'use client'
import { useState } from "react";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "admin",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field on change
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = "Invalid email format.";
      }
    }

    if (name === "phone") {
      if (!/^\d{10}$/.test(value)) {
        errorMsg = "Phone must be exactly 10 digits.";
      }
    }

    if (name === "password") {
      if (value.length < 8) {
        errorMsg = "Password must be at least 8 characters.";
      }
    }

    setErrors({ ...errors, [name]: errorMsg });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate all fields before submitting
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (!formData[key]) {
        newErrors[key] = "This field is required.";
      }
    });
  
    setErrors(newErrors);
  
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch("YOUR_API_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (data.ok) {
        setShowSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          role: "admin",
          password: "",
        });

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      {/* Form Container */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Create User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-gray-600 text-sm font-semibold mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-600 text-sm font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-gray-600 text-sm font-semibold mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          maxLength="10"
          pattern="\d{10}"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      {/* Role (Dropdown) */}
      <div>
        <label className="block text-gray-600 text-sm font-semibold mb-1">User Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="admin">Admin</option>
          <option value="salesperson">Salesperson</option>
        </select>
      </div>

      {/* Password */}
      <div>
        <label className="block text-gray-600 text-sm font-semibold mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      {/* Submit Button with Loading Animation */}
      <button
        type="submit"
        className={`w-full flex items-center justify-center px-4 py-2 font-bold text-white rounded-lg transition ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          "Create User"
        )}
      </button>
    </form>
      </div>

      {/* Success Message Animation */}
      {showSuccess && (
        <div
          className="fixed bottom-10 right-[-300px] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg text-sm font-semibold transition-all duration-500 animate-slide-in"
        >
          ✅ User Created Successfully!
        </div>
      )}

      {/* Tailwind CSS Animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            right: -300px;
          }
          to {
            right: 20px;
          }
        }
        @keyframes slideOut {
          from {
            right: 20px;
          }
          to {
            right: -300px;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.5s forwards, slideOut 0.5s 2.5s forwards;
        }
      `}</style>
    </div>
  );
};

export default CreateUser;
