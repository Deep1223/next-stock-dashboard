import { store } from '@/store/store';
import IISMethods from '@/utils/IISMethods';
import Config from '@/config/config';

/**
 * Redux Utility Functions
 * Centralized functions for Redux state management
 */

// ==================== STATE GETTERS ====================

/**
 * Get current Redux state
 * @returns {Object} Current Redux state
 */
export const getCurrentState = () => {
  return store.getState();
};

/**
 * Get specific state slice
 * @param {string} sliceName - Name of the state slice
 * @returns {Object} State slice
 */
export const getStateSlice = (sliceName) => {
  const state = store.getState();
  return state[sliceName];
};

/**
 * Get login info from state
 * @returns {Object} Login info object
 */
export const getLoginInfo = () => {
  const state = getCurrentState();
  return state?.logininfo || {};
};

/**
 * Check if user is authenticated (from logininfo)
 * @returns {boolean} Authentication status
 */
export const isUserAuthenticated = () => {
  const loginInfo = getLoginInfo();
  return loginInfo?.isAuthenticated || false;
};

/**
 * Get current user (from logininfo)
 * @returns {Object|null} Current user object
 */
export const getCurrentUser = () => {
  const loginInfo = getLoginInfo();
  return loginInfo?.user || null;
};

/**
 * Get authentication token (from logininfo)
 * @returns {string|null} Authentication token
 */
export const getAuthToken = () => {
  const loginInfo = getLoginInfo();
  return loginInfo?.token || null;
};

/**
 * Get main data from state
 * @returns {Array} Data array
 */
export const getData = () => {
  const state = getCurrentState();
  return state?.data || [];
};

/**
 * Get right sidebar form data from state
 * @returns {Array} Right sidebar form data array
 */
export const getRightSidebarFormData = () => {
  const state = getCurrentState();
  return state?.rightsidebarformdata || [];
};

/**
 * Get form data from state
 * @returns {Array} Form data array
 */
export const getFormData = () => {
  const state = getCurrentState();
  return state?.formdata || [];
};

/**
 * Get filter data from state
 * @returns {Object} Filter data object
 */
export const getFilterData = () => {
  const state = getCurrentState();
  return state?.filterdata || {};
};

/**
 * Get master data from state
 * @returns {Array} Master data array
 */
export const getMasterData = () => {
  const state = getCurrentState();
  return state?.masterdata || [];
};

/**
 * Get master data listing from state
 * @returns {Array} Master data listing array
 */
export const getMasterDataListing = () => {
  const state = getCurrentState();
  return state?.masterdatalisting || [];
};

/**
 * Get current page number from state
 * @returns {number} Current page number
 */
export const getPageNo = () => {
  const state = getCurrentState();
  return state?.pageno || 1;
};

/**
 * Get current page name from state
 * @returns {string} Current page name
 */
export const getPageName = () => {
  const state = getCurrentState();
  return state?.pagename || '';
};

/**
 * Get next page availability from state
 * @returns {number} Next page availability (1 or 0)
 */
export const getNextPage = () => {
  const state = getCurrentState();
  return state?.nextpage || 0;
};


/**
 * Get filtered data based on current filters
 * @returns {Array} Filtered data array
 */
export const getFilteredData = () => {
  const state = getCurrentState();
  const { data, filterdata } = state;
  let filteredData = data || [];

  if (filterdata?.status) {
    filteredData = filteredData.filter(item => item.status === filterdata.status);
  }
  if (filterdata?.role) {
    filteredData = filteredData.filter(item => item.role === filterdata.role);
  }
  if (filterdata?.search) {
    const searchTerm = filterdata.search.toLowerCase();
    filteredData = filteredData.filter(item =>
      item.name?.toLowerCase().includes(searchTerm) ||
      item.email?.toLowerCase().includes(searchTerm) ||
      item.phone?.toLowerCase().includes(searchTerm)
    );
  }

  return filteredData;
};


// ==================== STATE CHECKERS ====================

/**
 * Check if any loading is in progress
 * @returns {boolean} Loading status
 */
export const isLoading = () => {
  const state = getCurrentState();
  return state?.loading || false;
};

// ==================== DATA HELPERS ====================

/**
 * Find item by ID in data array
 * @param {string} itemId - Item ID
 * @returns {Object|null} Item object
 */
export const findItemById = (itemId) => {
  const data = getData();
  return data.find(item => item._id === itemId || item.id === itemId) || null;
};

/**
 * Get items by status
 * @param {string} status - Item status
 * @returns {Array} Items with specific status
 */
export const getItemsByStatus = (status) => {
  const data = getData();
  return data.filter(item => item.status === status);
};

/**
 * Get items by role
 * @param {string} role - Item role
 * @returns {Array} Items with specific role
 */
export const getItemsByRole = (role) => {
  const data = getData();
  return data.filter(item => item.role === role);
};

// ==================== VALIDATION HELPERS ====================

/**
 * Check if user has permission
 * @param {string} permission - Permission to check
 * @returns {boolean} Permission status
 */
export const hasPermission = (permission) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Add your permission logic here
  const userRole = user.userRole;
  
  switch (permission) {
    case 'admin':
      return userRole === Config.administrator;
    case 'create_user':
      return userRole === Config.administrator;
    case 'delete_user':
      return userRole === Config.administrator;
    case 'view_data':
      return userRole === Config.administrator || userRole === Config.salesuser;
    case 'create_data':
      return userRole === Config.administrator || userRole === Config.salesuser;
    default:
      return false;
  }
};

/**
 * Check if user can access route
 * @param {string} route - Route to check
 * @returns {boolean} Access status
 */
export const canAccessRoute = (route) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const userRole = user.userRole;
  
  switch (route) {
    case '/dashboard':
      return userRole === Config.administrator;
    case '/sales-dashboard':
      return userRole === Config.salesuser;
    case '/users':
      return userRole === Config.administrator;
    case '/data':
      return userRole === Config.administrator || userRole === Config.salesuser;
    default:
      return true;
  }
};

// ==================== STATE UPDATERS ====================

/**
 * Dispatch action to store
 * @param {Object} action - Redux action
 */
export const dispatchAction = (action) => {
  store.dispatch(action);
};

/**
 * Set main data in state
 * @param {Array} data - Data array
 */
export const setData = (data) => {
  const { setData: setDataAction } = require('@/store/reducer');
  dispatchAction(setDataAction(data));
};

/**
 * Set right sidebar form data in state
 * @param {Array} rightsidebarformdata - Right sidebar form data array
 */
export const setRightSidebarFormData = (rightsidebarformdata) => {
  const { setRightSidebarFormData: setRightSidebarFormDataAction } = require('@/store/reducer');
  dispatchAction(setRightSidebarFormDataAction(rightsidebarformdata));
};

/**
 * Set form data in state
 * @param {Object} formdata - Form data object
 */
export const setFormData = (formdata) => {
  const { setDataFormData: setDataFormDataAction } = require('@/store/reducer');
  dispatchAction(setDataFormDataAction(formdata));
};

/**
 * Set filter data in state
 * @param {Object} filterdata - Filter data object
 */
export const setFilterData = (filterdata) => {
  const { setFilterData: setFilterDataAction } = require('@/store/reducer');
  dispatchAction(setFilterDataAction(filterdata));
};

/**
 * Set master data in state
 * @param {Object} masterdata - Master data object
 */
export const setMasterData = (masterdata) => {
  const { setMasterData: setMasterDataAction } = require('@/store/reducer');
  dispatchAction(setMasterDataAction(masterdata));
};

/**
 * Set master data listing in state
 * @param {Array} masterdatalisting - Master data listing array
 */
export const setMasterDataListing = (masterdatalisting) => {
  const { setMasterDataListing: setMasterDataListingAction } = require('@/store/reducer');
  dispatchAction(setMasterDataListingAction(masterdatalisting));
};

/**
 * Set page number in state
 * @param {number} pageno - Page number
 */
export const setPageNo = (pageno) => {
  const { setPageNo: setPageNoAction } = require('@/store/reducer');
  dispatchAction(setPageNoAction(pageno));
};

/**
 * Set page name in state
 * @param {string} pagename - Page name
 */
export const setPageName = (pagename) => {
  const { setPageName: setPageNameAction } = require('@/store/reducer');
  dispatchAction(setPageNameAction(pagename));
};

/**
 * Set next page availability in state
 * @param {number} nextpage - Next page availability (1 or 0)
 */
export const setNextPage = (nextpage) => {
  const { setNextPage: setNextPageAction } = require('@/store/reducer');
  dispatchAction(setNextPageAction(nextpage));
};

/**
 * Set login info in state
 * @param {Object} logininfo - Login information
 */
export const setLoginInfo = (logininfo) => {
  const { setLoginInfo: setLoginInfoAction } = require('@/store/reducer');
  dispatchAction(setLoginInfoAction(logininfo));
};

/**
 * Set authentication user (using logininfo)
 * @param {Object} user - User object
 * @param {string} token - Authentication token
 */
export const setAuthUser = (user, token) => {
  const logininfo = {
    user,
    token,
    isAuthenticated: true,
    loginTime: new Date().toISOString()
  };
  setLoginInfo(logininfo);
};

/**
 * Clear authentication (using logininfo)
 */
export const clearAuth = () => {
  setLoginInfo({});
};

// ==================== PROPS SETTER FUNCTIONS ====================

/**
 * Set props function - works like props.setProps()
 * @param {Object} props - Object containing data to set
 */
export const setProps = (props) => {
  if (props.data !== undefined) {
    setData(props.data);
  }
  if (props.rightsidebarformdata !== undefined) {
    setRightSidebarFormData(props.rightsidebarformdata);
  }
  if (props.formdata !== undefined) {
    setDataFormData(props.formdata);
  }
  if (props.filterdata !== undefined) {
    setFilterData(props.filterdata);
  }
  if (props.masterdata !== undefined) {
    setMasterData(props.masterdata);
  }
  if (props.masterdatalisting !== undefined) {
    setMasterDataListing(props.masterdatalisting);
  }
  if (props.pageno !== undefined) {
    setPageNo(props.pageno);
  }
  if (props.pagename !== undefined) {
    setPageName(props.pagename);
  }
  if (props.nextpage !== undefined) {
    setNextPage(props.nextpage);
  }
  if (props.logininfo !== undefined) {
    setLoginInfo(props.logininfo);
  }
  if (props.loading !== undefined) {
    setDataLoading(props.loading);
  }
  if (props.error !== undefined) {
    setDataError(props.error);
  }
};

/**
 * Get props function - works like props.getProps()
 * @returns {Object} Current state as props
 */
export const getProps = () => {
  return {
    data: getData(),
    rightsidebarformdata: getRightSidebarFormData(),
    formdata: getFormData(),
    filterdata: getFilterData(),
    masterdata: getMasterData(),
    masterdatalisting: getMasterDataListing(),
    pageno: getPageNo(),
    pagename: getPageName(),
    nextpage: getNextPage(),
    logininfo: getLoginInfo(),
    loading: isLoading(),
    error: getCurrentState()?.error || null
  };
};

/**
 * Update user in state
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 */
export const updateUserInState = (userId, userData) => {
  const { updateUser } = require('@/store/reducer');
  dispatchAction(updateUser({ id: userId, userData }));
};

/**
 * Update lead in state
 * @param {string} leadId - Lead ID
 * @param {Object} leadData - Updated lead data
 */
export const updateLeadInState = (leadId, leadData) => {
  const { updateLead } = require('@/store/reducer');
  dispatchAction(updateLead({ id: leadId, leadData }));
};

/**
 * Open modal
 * @param {string} modalName - Modal name
 */
export const openModal = (modalName) => {
  const { openModal: openModalAction } = require('@/store/reducer');
  dispatchAction(openModalAction(modalName));
};

/**
 * Close modal
 * @param {string} modalName - Modal name
 */
export const closeModal = (modalName) => {
  const { closeModal: closeModalAction } = require('@/store/reducer');
  dispatchAction(closeModalAction(modalName));
};

/**
 * Toggle sidebar
 */
export const toggleSidebar = () => {
  const { toggleSidebar: toggleSidebarAction } = require('@/store/reducer');
  dispatchAction(toggleSidebarAction());
};

// ==================== ERROR HANDLERS ====================

/**
 * Handle Redux errors with toast notifications
 * @param {string} error - Error message
 * @param {string} action - Action that failed
 */
export const handleReduxError = (error, action = 'Operation') => {
  console.error(`Redux Error in ${action}:`, error);
  IISMethods.errormsg(`${action} failed: ${error}`, 1);
};

/**
 * Handle Redux success with toast notifications
 * @param {string} message - Success message
 * @param {string} action - Action that succeeded
 */
export const handleReduxSuccess = (message, action = 'Operation') => {
  IISMethods.successmsg(`${action} successful: ${message}`, 2);
};

// ==================== SUBSCRIPTION HELPERS ====================

/**
 * Subscribe to state changes
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToState = (callback) => {
  return store.subscribe(callback);
};

/**
 * Subscribe to specific state slice changes
 * @param {string} sliceName - State slice name
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToSlice = (sliceName, callback) => {
  let previousState = getStateSlice(sliceName);
  
  return store.subscribe(() => {
    const currentState = getStateSlice(sliceName);
    if (currentState !== previousState) {
      callback(currentState, previousState);
      previousState = currentState;
    }
  });
};

// ==================== PERSISTENCE HELPERS ====================

/**
 * Save state to localStorage
 * @param {string} key - Storage key
 * @param {Object} state - State to save
 */
export const saveStateToStorage = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

/**
 * Load state from localStorage
 * @param {string} key - Storage key
 * @returns {Object|null} Loaded state
 */
export const loadStateFromStorage = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return null;
  }
};

// ==================== DEBUG HELPERS ====================

/**
 * Log current state (for debugging)
 * @param {string} label - Log label
 */
export const logCurrentState = (label = 'Current State') => {
  if (process.env.NODE_ENV === 'development') {
    console.group(label);
    console.log('Full State:', getCurrentState());
    console.log('Auth State:', getStateSlice('auth'));
    console.log('Users State:', getStateSlice('users'));
    console.log('Leads State:', getStateSlice('leads'));
    console.log('UI State:', getStateSlice('ui'));
    console.log('Forms State:', getStateSlice('forms'));
    console.groupEnd();
  }
};

/**
 * Get state summary (for debugging)
 * @returns {Object} State summary
 */
export const getStateSummary = () => {
  const state = getCurrentState();
  return {
    isAuthenticated: state.auth?.isAuthenticated || false,
    userCount: state.users?.users?.length || 0,
    leadCount: state.leads?.leads?.length || 0,
    sidebarCollapsed: state.ui?.sidebarCollapsed || false,
    openModals: Object.keys(state.ui?.modals || {}).filter(
      key => state.ui.modals[key]
    ),
    loading: isLoading(),
  };
};
