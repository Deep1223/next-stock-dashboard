'use client'
import { useState } from "react";
import { useUsers } from '@/store/hooks';
import { createUser } from '@/store/reducer';
import IISMethods from "@/utils/IISMethods";
import Config from "@/config/config";

const CreateUser = () => {
  const { dispatch, loading } = useUsers();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "admin",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const validationRules = {
      email: { type: 'email', label: 'Email' },
      phone: { type: 'phone', label: 'Phone' },
      password: { type: 'password', label: 'Password' }
    };
    
    IISMethods.handleFieldChange(e, formData, setFormData, errors, setErrors, validationRules);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "email" && value && !IISMethods.validateEmail(value)) {
      errorMsg = Config.invalidEmailerror;
    }

    if (name === "phone" && value && !IISMethods.validatePhone(value)) {
      errorMsg = Config.invalidPhoneerror;
    }

    if (name === "password" && value) {
      const passwordValidation = IISMethods.validatePassword(value);
      if (!passwordValidation.isValid) {
        errorMsg = passwordValidation.message;
      }
    }

    setErrors({ ...errors, [name]: errorMsg });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate all fields before submitting
    const validationRules = {
      fullName: { required: true, label: 'Full Name' },
      email: { required: true, type: 'email', label: 'Email' },
      phone: { required: true, type: 'phone', label: 'Phone' },
      password: { required: true, type: 'password', label: 'Password' }
    };

    const newErrors = IISMethods.validateForm(formData, validationRules);
    setErrors(newErrors);
  
    if (IISMethods.hasFormErrors(newErrors)) {
      IISMethods.errormsg(Config.fillallrequiredfild, 1);
      return;
    }
  
    try {
      // Create user using Redux
      const userData = {
        userName: formData.fullName,
        userEmail: formData.email,
        userPassword: formData.password,
        userPhoneNumber: formData.phone,
        userRole: formData.role === "admin" ? Config.administrator : Config.salesuser
      };

      await dispatch(createUser(userData)).unwrap();
      IISMethods.successmsg(Config.usercreated, 2);
      
      // Reset form
      const initialFormData = {
        fullName: "",
        email: "",
        phone: "",
        role: "admin",
        password: "",
      };
      IISMethods.resetForm(initialFormData, setFormData, setErrors);
      
    } catch (error) {
      IISMethods.errormsg(error, 1);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      {/* Form Container */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {Config.createusertitle}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-gray-600 text-sm font-semibold mb-1">{Config.fullnamelabel}</label>
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
        <label className="block text-gray-600 text-sm font-semibold mb-1">{Config.emaillabel}</label>
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
        <label className="block text-gray-600 text-sm font-semibold mb-1">{Config.phonelabel}</label>
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
        <label className="block text-gray-600 text-sm font-semibold mb-1">{Config.rolelabel}</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="admin">{Config.admin}</option>
          <option value="salesperson">{Config.salesperson}</option>
        </select>
      </div>

      {/* Password */}
      <div>
        <label className="block text-gray-600 text-sm font-semibold mb-1">{Config.passwordlabel}</label>
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
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={loading}
      >
        {loading ? (
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
            {Config.saving}
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
