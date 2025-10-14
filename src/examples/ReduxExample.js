"use client";
import { useEffect } from 'react';
import { useUsers, useLeads, useAuth, useUI, useForms } from '@/store/hooks';
import { 
  fetchUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
  loginUser,
  logoutUser,
  setFilters,
  openModal,
  closeModal,
  toggleSidebar,
  setFormData,
  setFormErrors,
  clearForm
} from '@/store/reducer';
import { 
  getCurrentState, 
  getCurrentUser, 
  isUserAuthenticated,
  getUsers,
  getLeads,
  getFilteredLeads,
  findUserById,
  findLeadById,
  hasPermission,
  canAccessRoute,
  logCurrentState,
  getStateSummary
} from '@/utils/reduxUtils';
import IISMethods from '@/utils/IISMethods';
import Config from '@/config/config';

/**
 * Redux Usage Example Component
 * Demonstrates how to use Redux in your application
 */
const ReduxExample = () => {
  // Using custom hooks
  const { users, loading: usersLoading, error: usersError, dispatch } = useUsers();
  const { leads, filters, loading: leadsLoading, error: leadsError, dispatch: leadsDispatch } = useLeads();
  const { user, isAuthenticated, loading: authLoading, dispatch: authDispatch } = useAuth();
  const { sidebarCollapsed, modals, dispatch: uiDispatch } = useUI();
  const { userForm, leadForm, dispatch: formsDispatch } = useForms();

  // Load data on component mount
  useEffect(() => {
    // Fetch users and leads when component mounts
    dispatch(fetchUsers());
    leadsDispatch(fetchLeads());
  }, [dispatch, leadsDispatch]);

  // Example 1: Using getCurrentState() function
  const handleGetCurrentState = () => {
    const currentState = getCurrentState();
    console.log('Current Redux State:', currentState);
    IISMethods.infomsg('Current state logged to console', 4);
  };

  // Example 2: Using getCurrentUser() function
  const handleGetCurrentUser = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      IISMethods.successmsg(`Current user: ${currentUser.userName}`, 2);
    } else {
      IISMethods.warningmsg('No user logged in', 3);
    }
  };

  // Example 3: Using isUserAuthenticated() function
  const handleCheckAuth = () => {
    const authenticated = isUserAuthenticated();
    IISMethods.infomsg(`User authenticated: ${authenticated}`, 4);
  };

  // Example 4: Using getUsers() function
  const handleGetUsers = () => {
    const allUsers = getUsers();
    IISMethods.infomsg(`Total users: ${allUsers.length}`, 4);
  };

  // Example 5: Using getLeads() function
  const handleGetLeads = () => {
    const allLeads = getLeads();
    IISMethods.infomsg(`Total leads: ${allLeads.length}`, 4);
  };

  // Example 6: Using getFilteredLeads() function
  const handleGetFilteredLeads = () => {
    const filteredLeads = getFilteredLeads();
    IISMethods.infomsg(`Filtered leads: ${filteredLeads.length}`, 4);
  };

  // Example 7: Using findUserById() function
  const handleFindUser = () => {
    if (users.length > 0) {
      const firstUser = findUserById(users[0]._id);
      if (firstUser) {
        IISMethods.successmsg(`Found user: ${firstUser.userName}`, 2);
      }
    } else {
      IISMethods.warningmsg('No users available', 3);
    }
  };

  // Example 8: Using hasPermission() function
  const handleCheckPermission = () => {
    const canCreateUser = hasPermission('create_user');
    const canViewLeads = hasPermission('view_leads');
    IISMethods.infomsg(`Can create user: ${canCreateUser}, Can view leads: ${canViewLeads}`, 4);
  };

  // Example 9: Using canAccessRoute() function
  const handleCheckRouteAccess = () => {
    const canAccessUsers = canAccessRoute('/users');
    const canAccessLeads = canAccessRoute('/leads');
    IISMethods.infomsg(`Can access /users: ${canAccessUsers}, Can access /leads: ${canAccessLeads}`, 4);
  };

  // Example 10: Using Redux actions
  const handleCreateUser = async () => {
    const userData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      userPassword: 'password123',
      userPhoneNumber: '1234567890',
      userRole: Config.salesuser
    };

    try {
      await dispatch(createUser(userData)).unwrap();
      IISMethods.successmsg(Config.usercreated, 2);
    } catch (error) {
      IISMethods.errormsg(error, 1);
    }
  };

  // Example 11: Using Redux actions for leads
  const handleCreateLead = async () => {
    const leadData = {
      name: 'Test Lead',
      email: 'lead@example.com',
      phone: '9876543210',
      status: Config.newlead,
      source: 'Website'
    };

    try {
      await leadsDispatch(createLead(leadData)).unwrap();
      IISMethods.successmsg(Config.leadcreated, 2);
    } catch (error) {
      IISMethods.errormsg(error, 1);
    }
  };

  // Example 12: Using UI actions
  const handleToggleSidebar = () => {
    uiDispatch(toggleSidebar());
    IISMethods.infomsg(`Sidebar ${sidebarCollapsed ? 'expanded' : 'collapsed'}`, 4);
  };

  // Example 13: Using modal actions
  const handleOpenModal = () => {
    uiDispatch(openModal('createUser'));
    IISMethods.infomsg('Create User modal opened', 4);
  };

  const handleCloseModal = () => {
    uiDispatch(closeModal('createUser'));
    IISMethods.infomsg('Create User modal closed', 4);
  };

  // Example 14: Using form actions
  const handleSetFormData = () => {
    const formData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890'
    };
    formsDispatch(setFormData({ formName: 'userForm', data: formData }));
    IISMethods.successmsg('Form data set', 2);
  };

  const handleClearForm = () => {
    formsDispatch(clearForm('userForm'));
    IISMethods.infomsg('Form cleared', 4);
  };

  // Example 15: Using filter actions
  const handleSetFilters = () => {
    leadsDispatch(setFilters({ status: Config.newlead, search: 'test' }));
    IISMethods.infomsg('Filters applied', 4);
  };

  // Example 16: Using debug functions
  const handleLogState = () => {
    logCurrentState('Redux Example State');
    IISMethods.infomsg('State logged to console', 4);
  };

  const handleGetStateSummary = () => {
    const summary = getStateSummary();
    console.log('State Summary:', summary);
    IISMethods.infomsg('State summary logged to console', 4);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Redux Usage Examples</h2>
          <p className="text-muted mb-4">
            This component demonstrates various ways to use Redux in your application.
          </p>
        </div>
      </div>

      {/* State Information */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Current State Info</h5>
            </div>
            <div className="card-body">
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Current User:</strong> {user?.userName || 'None'}</p>
              <p><strong>Users Count:</strong> {users.length}</p>
              <p><strong>Leads Count:</strong> {leads.length}</p>
              <p><strong>Sidebar Collapsed:</strong> {sidebarCollapsed ? 'Yes' : 'No'}</p>
              <p><strong>Loading:</strong> {usersLoading || leadsLoading || authLoading ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Form Data</h5>
            </div>
            <div className="card-body">
              <p><strong>User Form Data:</strong></p>
              <pre className="bg-light p-2 rounded small">
                {JSON.stringify(userForm.data, null, 2)}
              </pre>
              <p><strong>Lead Form Data:</strong></p>
              <pre className="bg-light p-2 rounded small">
                {JSON.stringify(leadForm.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Utility Functions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Redux Utility Functions</h5>
            </div>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleGetCurrentState} className="btn btn-outline-primary w-100">
                    getCurrentState()
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleGetCurrentUser} className="btn btn-outline-primary w-100">
                    getCurrentUser()
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleCheckAuth} className="btn btn-outline-primary w-100">
                    isUserAuthenticated()
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleGetUsers} className="btn btn-outline-primary w-100">
                    getUsers()
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleGetLeads} className="btn btn-outline-primary w-100">
                    getLeads()
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleGetFilteredLeads} className="btn btn-outline-primary w-100">
                    getFilteredLeads()
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleFindUser} className="btn btn-outline-primary w-100">
                    findUserById()
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleCheckPermission} className="btn btn-outline-primary w-100">
                    hasPermission()
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleCheckRouteAccess} className="btn btn-outline-primary w-100">
                    canAccessRoute()
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleLogState} className="btn btn-outline-info w-100">
                    logCurrentState()
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleGetStateSummary} className="btn btn-outline-info w-100">
                    getStateSummary()
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redux Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Redux Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleCreateUser} className="btn btn-success w-100">
                    Create User
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleCreateLead} className="btn btn-success w-100">
                    Create Lead
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleToggleSidebar} className="btn btn-warning w-100">
                    Toggle Sidebar
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleOpenModal} className="btn btn-info w-100">
                    Open Modal
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleCloseModal} className="btn btn-secondary w-100">
                    Close Modal
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetFormData} className="btn btn-primary w-100">
                    Set Form Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleClearForm} className="btn btn-outline-secondary w-100">
                    Clear Form
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetFilters} className="btn btn-outline-warning w-100">
                    Set Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Usage Examples</h5>
            </div>
            <div className="card-body">
              <h6>1. Using getCurrentState():</h6>
              <pre className="bg-light p-3 rounded">
{`import { getCurrentState } from '@/utils/reduxUtils';

const currentState = getCurrentState();
console.log('Current Redux State:', currentState);`}
              </pre>

              <h6 className="mt-3">2. Using Redux Hooks:</h6>
              <pre className="bg-light p-3 rounded">
{`import { useUsers, useLeads, useAuth } from '@/store/hooks';

const { users, loading, dispatch } = useUsers();
const { leads, filters, dispatch: leadsDispatch } = useLeads();
const { user, isAuthenticated, dispatch: authDispatch } = useAuth();`}
              </pre>

              <h6 className="mt-3">3. Using Redux Actions:</h6>
              <pre className="bg-light p-3 rounded">
{`import { fetchUsers, createUser, openModal } from '@/store/reducer';

// Fetch users
dispatch(fetchUsers());

// Create user
dispatch(createUser(userData));

// Open modal
dispatch(openModal('createUser'));`}
              </pre>

              <h6 className="mt-3">4. Using Utility Functions:</h6>
              <pre className="bg-light p-3 rounded">
{`import { 
  getCurrentUser, 
  isUserAuthenticated, 
  hasPermission,
  canAccessRoute 
} from '@/utils/reduxUtils';

const user = getCurrentUser();
const authenticated = isUserAuthenticated();
const canCreate = hasPermission('create_user');
const canAccess = canAccessRoute('/users');`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReduxExample;
