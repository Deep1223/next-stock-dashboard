/**
 * ApiService - Universal API service for handling all HTTP requests
 * Works with dynamic pagealias for all CRUD operations
 */

import Config from '@/config/config';
import { getCurrentState } from './reduxUtils';

class ApiService {
    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || Config.apiBaseUrl;
        this.timeout = 30000; // 30 seconds
    }

    /**
     * Generate unique ID (for frontend use if needed)
     * @param {string} prefix - Prefix for the ID
     * @returns {string} Unique ID
     */
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Make API request with timeout and error handling
     * @param {string} url - API URL
     * @param {object} options - Fetch options
     * @returns {Promise} API response
     */
    async makeApiRequest(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                signal: controller.signal,
                ...options
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }

            throw error;
        }
    }

    /**
     * CREATE - Add new record
     * @param {string} pagealias - API endpoint name (e.g., 'stockmaster')
     * @param {object} data - Data to be added
     * @returns {Promise<object>} Response with status, message, and data
     */
    async create(pagealias, data) {
        try {
            const url = `${this.baseUrl}/${pagealias}/add`;

            const response = await this.makeApiRequest(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "username": `${getCurrentState().logininfo.firstName} ${getCurrentState().logininfo.lastName}` || 'Guest',
                },
                body: JSON.stringify(data)
            });

            return {
                status: response.success ? 200 : 400,
                success: response.success,
                message: response.message || `${pagealias} created successfully`,
                data: response.data || response
            };
        } catch (error) {
            console.error(`Error creating ${pagealias}:`, error);
            return {
                status: 500,
                success: false,
                message: error.message || `Failed to create ${pagealias}`,
                data: null
            };
        }
    }


    /**
     * READ - Get list with pagination, filters, sort, and search
     * @param {string} pagealias - API endpoint name
     * @param {object} options - Query options
     * @param {object} options.pagination - Pagination config {page, limit}
     * @param {object} options.sort - Sort config {field, order}
     * @param {object} options.filters - Filter object
     * @param {string} options.search - Search term
     * @param {object} options.projection - Fields to include/exclude
     * @returns {Promise<object>} Response with data array and metadata
     */
    async read(pagealias, options = {}) {
        try {
            console.log('pagealias', pagealias)
            if (pagealias) {
                const {
                    pagination = { page: 1, limit: 20 },
                    sort = {},
                    filters = {},
                    search = ''
                } = options;

                // Build payload for POST request
                const payload = {
                    searchtext: search.trim(),
                    paginationinfo: {
                        pageno: pagination.page,
                        pagelimit: pagination.limit,
                        filter: filters,
                        sort: sort.field ? { [sort.field]: sort.order } : {}
                    }
                };

                const url = `${this.baseUrl}/${pagealias}`;
                
                // Send POST request instead of GET
                const response = await this.makeApiRequest(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                // Handle new response format
                if (response.respstatus === 200 && response.data) {
                    const { data, currentpage, nextpage, totaldocs, status, message } = response.data;

                    return {
                        status: status || 200,
                        success: status === 200,
                        message: message || 'Data fetched successfully',
                        data: data || [],
                        totalCount: totaldocs || 0,
                        currentPage: currentpage || pagination.page,
                        totalPages: Math.ceil((totaldocs || 0) / pagination.limit),
                        hasNextPage: nextpage > 0,
                        nextPage: nextpage,
                        limit: pagination.limit
                    };
                }

                // Handle error response
                return {
                    status: response.respstatus || 400,
                    success: false,
                    message: response.data?.message || 'Failed to fetch data',
                    data: [],
                    totalCount: 0,
                    hasNextPage: false,
                    nextPage: 0
                };
            }
        } catch (error) {
            console.error(`Error reading ${pagealias}:`, error);
            return {
                status: 500,
                success: false,
                message: error.message || `Failed to fetch ${pagealias}`,
                data: [],
                totalCount: 0,
                hasNextPage: false,
                nextPage: 0
            };
        }
    }

    /**
     * UPDATE - Update existing record
     * @param {string} pagealias - API endpoint name
     * @param {string|number} id - Record ID
     * @param {object} data - Updated data
     * @returns {Promise<object>} Response with status and message
     */
    async update(pagealias, id, data) {
        try {
            if (pagealias) {
                const url = `${this.baseUrl}/${pagealias}/update`;

                const response = await this.makeApiRequest(url, {
                    method: "PUT",   // 🔥 POST → PUT
                    headers: {
                        "Content-Type": "application/json",
                        "username": `${getCurrentState().logininfo.firstName} ${getCurrentState().logininfo.lastName}` || 'Guest',
                    },
                    body: JSON.stringify({ id, ...data })
                });

                return {
                    status: response.success ? 200 : 400,
                    success: response.success,
                    message: response.message || `${pagealias} updated successfully`,
                    data: response.data || response
                };
            }
        } catch (error) {
            console.error(`Error updating ${pagealias}:`, error);
            return {
                status: 500,
                success: false,
                message: error.message || `Failed to update ${pagealias}`,
                data: null
            };
        }
    }


    /**
     * DELETE - Delete record
     * @param {string} pagealias - API endpoint name
     * @param {string|number} id - Record ID
     * @returns {Promise<object>} Response with status and message
     */
    /**
 * DELETE - Delete record
 * @param {string} pagealias - API endpoint name
 * @param {string|number} id - Record ID
 * @returns {Promise<object>} Response with status and message
 */
    async delete(pagealias, id) {
        try {
            // Validate inputs
            if (pagealias) {
                const url = `${this.baseUrl}/${pagealias}/delete`;

                const response = await this.makeApiRequest(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id })
                });

                return {
                    status: response.success ? 200 : 400,
                    success: response.success,
                    message: response.message || `${pagealias} deleted successfully`,
                    data: response.data || response
                };
            }

        } catch (error) {
            console.error(`Error deleting ${pagealias}:`, error);
            return {
                status: 500,
                success: false,
                message: error.message || `Failed to delete ${pagealias}`,
                data: null
            };
        }
    }

    /**
     * GET BY ID - Get single record by ID
     * @param {string} pagealias - API endpoint name
     * @param {string|number} id - Record ID
     * @returns {Promise<object>} Response with single record
     */
    async getById(pagealias, id) {
        try {
            if (pagealias) {
                const url = `${this.baseUrl}/${pagealias}/${id}`;
                const response = await this.makeApiRequest(url, {
                    method: 'GET'
                });

                return {
                    status: response.success ? 200 : 400,
                    success: response.success,
                    message: response.message || 'Record fetched successfully',
                    data: response.data || null
                };
            }
        } catch (error) {
            console.error(`Error fetching ${pagealias} by ID:`, error);
            return {
                status: 500,
                success: false,
                message: error.message || `Failed to fetch ${pagealias}`,
                data: null
            };
        }
    }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;