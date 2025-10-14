import { toast } from 'react-toastify';
import Config from '@/config/config';

/**
 * IISMethods - Centralized utility functions for the application
 * All common getter/setter functions and utility methods
 */
class IISMethods {
    
    // ==================== TOAST MESSAGE FUNCTIONS ====================
    
    /**
     * Show error message with toast
     * @param {string} message - Error message
     * @param {number} type - Toast type (1=error, 2=success, 3=warning, 4=info)
     * @param {object} options - Additional toast options
     */
    static errormsg(message, type = 1, options = {}) {
        const defaultOptions = {
            position: "top-right",
            autoClose: type === 1 ? 5000 : 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        };

        const toastOptions = { ...defaultOptions, ...options };

        switch (type) {
            case 1: // Error
                toast.error(message, toastOptions);
                break;
            case 2: // Success
                toast.success(message, toastOptions);
                break;
            case 3: // Warning
                toast.warning(message, toastOptions);
                break;
            case 4: // Info
                toast.info(message, toastOptions);
                break;
            default:
                toast(message, toastOptions);
        }
    }

    /**
     * Show success message
     * @param {string} message - Success message
     * @param {object} options - Additional options
     */
    static successmsg(message, options = {}) {
        this.errormsg(message, 2, options);
    }

    /**
     * Show warning message
     * @param {string} message - Warning message
     * @param {object} options - Additional options
     */
    static warningmsg(message, options = {}) {
        this.errormsg(message, 3, options);
    }

    /**
     * Show info message
     * @param {string} message - Info message
     * @param {object} options - Additional options
     */
    static infomsg(message, options = {}) {
        this.errormsg(message, 4, options);
    }

    // ==================== FORM VALIDATION FUNCTIONS ====================

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Is valid email
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone number (10 digits)
     * @param {string} phone - Phone to validate
     * @returns {boolean} - Is valid phone
     */
    static validatePhone(phone) {
        return /^\d{10}$/.test(phone);
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {object} - Validation result with isValid and message
     */
    static validatePassword(password) {
        if (password.length < 8) {
            return { isValid: false, message: "Password must be at least 8 characters" };
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return { isValid: false, message: "Password must contain at least one lowercase letter" };
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return { isValid: false, message: "Password must contain at least one uppercase letter" };
        }
        if (!/(?=.*\d)/.test(password)) {
            return { isValid: false, message: "Password must contain at least one number" };
        }
        if (!/(?=.*[@$!%*?&])/.test(password)) {
            return { isValid: false, message: "Password must contain at least one special character" };
        }
        return { isValid: true, message: "Password is valid" };
    }

    /**
     * Validate required field
     * @param {string} value - Value to validate
     * @param {string} fieldName - Name of the field
     * @returns {string|null} - Error message or null
     */
    static validateRequired(value, fieldName) {
        if (!value || value.trim() === '') {
            return `${fieldName} is required`;
        }
        return null;
    }

    /**
     * Validate form data
     * @param {object} formData - Form data to validate
     * @param {object} validationRules - Validation rules
     * @returns {object} - Validation result with errors
     */
    static validateForm(formData, validationRules) {
        const errors = {};
        
        Object.keys(validationRules).forEach(field => {
            const rules = validationRules[field];
            const value = formData[field];
            
            // Required validation
            if (rules.required && this.validateRequired(value, rules.label)) {
                errors[field] = this.validateRequired(value, rules.label);
                return;
            }
            
            // Type-specific validation
            if (value && rules.type === 'email' && !this.validateEmail(value)) {
                errors[field] = Config.invalidEmailerror;
            } else if (value && rules.type === 'phone' && !this.validatePhone(value)) {
                errors[field] = `${rules.label} must be exactly 10 digits`;
            } else if (value && rules.type === 'password') {
                const passwordValidation = this.validatePassword(value);
                if (!passwordValidation.isValid) {
                    errors[field] = passwordValidation.message;
                }
            }
        });
        
        return errors;
    }

    // ==================== DATA MANIPULATION FUNCTIONS ====================

    /**
     * Deep clone an object
     * @param {object} obj - Object to clone
     * @returns {object} - Cloned object
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    /**
     * Format date to readable string
     * @param {Date|string} date - Date to format
     * @param {string} format - Date format
     * @returns {string} - Formatted date
     */
    static formatDate(date, format = 'DD/MM/YYYY') {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        switch (format) {
            case 'DD/MM/YYYY':
                return `${day}/${month}/${year}`;
            case 'MM/DD/YYYY':
                return `${month}/${day}/${year}`;
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            case 'DD/MM/YYYY HH:mm':
                return `${day}/${month}/${year} ${hours}:${minutes}`;
            default:
                return d.toLocaleDateString();
        }
    }

    /**
     * Generate unique ID
     * @param {string} prefix - Prefix for the ID
     * @returns {string} - Unique ID
     */
    static generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Debounce function
     * @param {function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {function} - Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     * @param {function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {function} - Throttled function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ==================== LOCAL STORAGE FUNCTIONS ====================

    /**
     * Set item in localStorage with error handling
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {boolean} - Success status
     */
    static setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting localStorage:', error);
            this.errormsg('Failed to save data locally', 1);
            return false;
        }
    }

    /**
     * Get item from localStorage with error handling
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} - Retrieved value or default
     */
    static getLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error getting localStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} - Success status
     */
    static removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing localStorage:', error);
            return false;
        }
    }

    /**
     * Clear all localStorage
     * @returns {boolean} - Success status
     */
    static clearLocalStorage() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // ==================== API HELPER FUNCTIONS ====================

    /**
     * Make API request with error handling
     * @param {string} url - API URL
     * @param {object} options - Fetch options
     * @returns {Promise} - API response
     */
    static async apiRequest(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            this.errormsg('Network error. Please try again.', 1);
            throw error;
        }
    }

    /**
     * Handle API errors consistently
     * @param {Error} error - Error object
     * @param {string} defaultMessage - Default error message
     */
    static handleApiError(error, defaultMessage = 'An error occurred') {
        const message = error?.response?.data?.message || error?.message || defaultMessage;
        this.errormsg(message, 1);
    }

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Capitalize first letter of string
     * @param {string} str - String to capitalize
     * @returns {string} - Capitalized string
     */
    static capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    /**
     * Convert string to title case
     * @param {string} str - String to convert
     * @returns {string} - Title case string
     */
    static toTitleCase(str) {
        if (!str) return '';
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    /**
     * Check if value is empty (null, undefined, empty string, empty array, empty object)
     * @param {any} value - Value to check
     * @returns {boolean} - Is empty
     */
    static isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    }

    /**
     * Get file extension from filename
     * @param {string} filename - Filename
     * @returns {string} - File extension
     */
    static getFileExtension(filename) {
        if (!filename) return '';
        return filename.split('.').pop().toLowerCase();
    }

    /**
     * Format file size in human readable format
     * @param {number} bytes - File size in bytes
     * @returns {string} - Formatted file size
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Sleep/delay function
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise} - Promise that resolves after delay
     */
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Retry function with exponential backoff
     * @param {function} fn - Function to retry
     * @param {number} retries - Number of retries
     * @param {number} delay - Initial delay in ms
     * @returns {Promise} - Promise that resolves with function result
     */
    static async retry(fn, retries = 3, delay = 1000) {
        try {
            return await fn();
        } catch (error) {
            if (retries > 0) {
                await this.sleep(delay);
                return this.retry(fn, retries - 1, delay * 2);
            }
            throw error;
        }
    }

    // ==================== FORM HELPER FUNCTIONS ====================

    /**
     * Reset form data to initial state
     * @param {object} initialData - Initial form data
     * @param {function} setFormData - Setter function
     * @param {function} setErrors - Setter function for errors
     */
    static resetForm(initialData, setFormData, setErrors) {
        setFormData(initialData);
        setErrors({});
    }

    /**
     * Handle form field change
     * @param {Event} e - Event object
     * @param {object} formData - Current form data
     * @param {function} setFormData - Setter function
     * @param {object} errors - Current errors
     * @param {function} setErrors - Setter function for errors
     * @param {object} validationRules - Validation rules
     */
    static handleFieldChange(e, formData, setFormData, errors, setErrors, validationRules = {}) {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);

        // Clear error for this field
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }

        // Validate field if rules exist
        if (validationRules[name]) {
            const fieldErrors = this.validateForm(newFormData, { [name]: validationRules[name] });
            if (fieldErrors[name]) {
                setErrors({ ...errors, [name]: fieldErrors[name] });
            }
        }
    }

    /**
     * Check if form has errors
     * @param {object} errors - Form errors
     * @returns {boolean} - Has errors
     */
    static hasFormErrors(errors) {
        return Object.keys(errors).length > 0;
    }

    /**
     * Get first error message
     * @param {object} errors - Form errors
     * @returns {string|null} - First error message
     */
    static getFirstError(errors) {
        const errorKeys = Object.keys(errors);
        return errorKeys.length > 0 ? errors[errorKeys[0]] : null;
    }
}

export default IISMethods;
