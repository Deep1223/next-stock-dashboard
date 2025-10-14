"use client";
import { useEffect } from 'react';
import { useData } from '@/store/hooks';
import { 
  setData,
  setRightSidebarFormData,
  setDataFormData,
  setFilterData,
  setMasterData,
  setMasterDataListing,
  setPageNo,
  setPageName,
  setNextPage,
  setLoginInfo
} from '@/store/reducer';
import { 
  getCurrentState,
  getData,
  getFormData,
  getFilterData,
  getLoginInfo,
  setData as setDataUtil,
  setDataFormData as setDataFormDataUtil,
  setLoginInfo as setLoginInfoUtil
} from '@/utils/reduxUtils';
import MasterJson from '@/config/masterJSON';
import IISMethods from '@/utils/IISMethods';
import Config from '@/config/config';

/**
 * Simple State-Based Redux Example
 * Demonstrates easy state management with only data slice
 */
const SimpleStateExample = () => {
  const { 
    data, 
    rightsidebarformdata, 
    formdata, 
    filterdata, 
    masterdata, 
    masterdatalisting, 
    pageno, 
    pagename, 
    nextpage, 
    logininfo,
    loading, 
    error, 
    dispatch 
  } = useData();

  // Load initial data
  useEffect(() => {
    // Set page name
    dispatch(setPageName('Simple State Example'));
    
    // Set right sidebar form data from master JSON
    if (MasterJson.users && MasterJson.users.length > 0) {
      dispatch(setRightSidebarFormData(MasterJson.users[0].fields));
    }
  }, [dispatch]);

  // Example 1: Set data using utility functions
  const handleSetData = () => {
    const sampleData = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'salesperson' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'admin' }
    ];
    
    setDataUtil(sampleData);
    IISMethods.successmsg('Data set using utility functions', 2);
  };

  // Example 2: Set form data using utility functions
  const handleSetFormData = () => {
    const sampleFormData = [
      { field: 'fullname', value: 'John Doe' },
      { field: 'email', value: 'john@example.com' },
      { field: 'phone', value: '1234567890' },
      { field: 'role', value: 'admin' }
    ];
    
    setDataFormDataUtil(sampleFormData);
    IISMethods.successmsg('Form data set using utility functions', 2);
  };

  // Example 3: Set login info using utility functions
  const handleSetLoginInfo = () => {
    const sampleLoginInfo = {
      user: {
        _id: '1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        userRole: 'admin'
      },
      token: 'sample-token-123',
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    };
    
    setLoginInfoUtil(sampleLoginInfo);
    IISMethods.successmsg('Login info set using utility functions', 2);
  };

  // Example 4: Set pagination using utility functions
  const handleSetPagination = () => {
    setPageNoUtil(2);
    setNextPageUtil(1);
    IISMethods.infomsg('Pagination set: Page 2, Next page available', 4);
  };

  // Example 5: Set master data using utility functions
  const handleSetMasterData = () => {
    const sampleMasterData = [
      { label: 'Admin', value: 'admin' },
      { label: 'Sales Person', value: 'salesperson' }
    ];
    
    setMasterDataUtil(sampleMasterData);
    IISMethods.successmsg('Master data set using utility functions', 2);
  };

  // Example 6: Set filter data using utility functions
  const handleSetFilterData = () => {
    const sampleFilterData = {
      status: 'active',
      role: 'admin',
      search: 'john'
    };
    
    setFilterDataUtil(sampleFilterData);
    IISMethods.successmsg('Filter data set using utility functions', 2);
  };

  // Example 7: Get current state using utility functions
  const handleGetCurrentState = () => {
    const currentState = getCurrentState();
    const currentData = getData();
    const currentFormData = getFormData();
    const currentFilterData = getFilterData();
    const currentLoginInfo = getLoginInfo();
    
    console.log('Current State:', currentState);
    console.log('Current Data:', currentData);
    console.log('Current Form Data:', currentFormData);
    console.log('Current Filter Data:', currentFilterData);
    console.log('Current Login Info:', currentLoginInfo);
    
    IISMethods.infomsg('Current state logged to console', 4);
  };


  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Simple State-Based Redux Example</h2>
          <p className="text-muted mb-4">
            This demonstrates the simplified Redux setup with only the data slice containing all required keys.
          </p>
        </div>
      </div>

      {/* Current State Display */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Current State</h5>
            </div>
            <div className="card-body">
              <p><strong>Data Count:</strong> {data.length}</p>
              <p><strong>Form Data Keys:</strong> {Object.keys(formdata).join(', ') || 'None'}</p>
              <p><strong>Filter Data Keys:</strong> {Object.keys(filterdata).join(', ') || 'None'}</p>
              <p><strong>Master Data Keys:</strong> {Object.keys(masterdata).join(', ') || 'None'}</p>
              <p><strong>Page No:</strong> {pageno}</p>
              <p><strong>Page Name:</strong> {pagename}</p>
              <p><strong>Next Page:</strong> {nextpage}</p>
              <p><strong>User:</strong> {logininfo?.user?.userName || 'Not logged in'}</p>
              <p><strong>Authenticated:</strong> {logininfo?.isAuthenticated ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Form Data Preview</h5>
            </div>
            <div className="card-body">
              <pre className="bg-light p-2 rounded small">
                {JSON.stringify(formdata, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Utility Functions Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Utility Functions Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetData} className="btn btn-primary w-100">
                    Set Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetFormData} className="btn btn-success w-100">
                    Set Form Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetLoginInfo} className="btn btn-info w-100">
                    Set Login Info
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetPagination} className="btn btn-warning w-100">
                    Set Pagination
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetMasterData} className="btn btn-secondary w-100">
                    Set Master Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetFilterData} className="btn btn-dark w-100">
                    Set Filter Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Utility Functions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Utility Functions</h5>
            </div>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetDataWithUtils} className="btn btn-outline-primary w-100">
                    Set Data (Utils)
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetFormDataWithUtils} className="btn btn-outline-success w-100">
                    Set Form Data (Utils)
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetLoginInfoWithUtils} className="btn btn-outline-info w-100">
                    Set Login Info (Utils)
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleGetCurrentState} className="btn btn-outline-warning w-100">
                    Get Current State
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Usage Examples</h5>
            </div>
            <div className="card-body">
              <h6>1. Using the Data Hook:</h6>
              <pre className="bg-light p-3 rounded">
{`import { useData } from '@/store/hooks';

const { 
  data, 
  formdata, 
  filterdata, 
  logininfo,
  pageno, 
  pagename, 
  nextpage, 
  dispatch 
} = useData();`}
              </pre>

              <h6 className="mt-3">2. Setting Data with Dispatch:</h6>
              <pre className="bg-light p-3 rounded">
{`import { 
  setData,
  setDataFormData,
  setLoginInfo,
  setPageNo,
  setPageName
} from '@/store/reducer';

// Set data
dispatch(setData(apiData));

// Set form data
dispatch(setDataFormData({ name: 'John', email: 'john@example.com' }));

// Set login info
dispatch(setLoginInfo({
  user: { userName: 'John', userRole: 'admin' },
  token: 'token123',
  isAuthenticated: true
}));

// Set pagination
dispatch(setPageNo(2));
dispatch(setPageName('Users Page'));`}
              </pre>

              <h6 className="mt-3">3. Using Utility Functions:</h6>
              <pre className="bg-light p-3 rounded">
{`import { 
  getCurrentState,
  getData,
  getFormData,
  getLoginInfo,
  setData,
  setDataFormData,
  setLoginInfo
} from '@/utils/reduxUtils';

// Get current state
const currentState = getCurrentState();
const currentData = getData();
const currentFormData = getFormData();
const currentLoginInfo = getLoginInfo();

// Set data using utilities
setData(apiData);
setDataFormData({ name: 'John' });
setLoginInfo({ user: userData, token: 'token' });`}
              </pre>

              <h6 className="mt-3">4. State Structure:</h6>
              <pre className="bg-light p-3 rounded">
{`// Redux State Structure (All keys at root level):
{
  data: [],                    // Store API data or localStorage gridlist data
  rightsidebarformdata: [],    // Set rightsidebarformdata for rightsidebar field set from masterjson
  formdata: [],               // Set rightsidebar fields value in formdata
  filterdata: {},             // Set filter rightsidebar value same as formdata
  masterdata: [],             // Store API data in label and value array of object
  masterdatalisting: [],      // Store API data
  pageno: 1,                  // Set current page no
  pagename: '',               // Set current page name
  nextpage: 0,                // (1 and 0) if more data available so 1 else 0
  logininfo: {},              // Login information
  loading: false,
  error: null
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStateExample;
