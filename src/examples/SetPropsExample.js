"use client";
import { useEffect } from 'react';
import { useData } from '@/store/hooks';
import { setProps, getProps } from '@/utils/reduxUtils';
import IISMethods from '@/utils/IISMethods';
import Config from '@/config/config';

/**
 * SetProps Example Component
 * Demonstrates how to use setProps() function like props.setProps()
 */
const SetPropsExample = () => {
  const { 
    data, 
    formdata, 
    filterdata, 
    masterdata, 
    pageno, 
    pagename, 
    nextpage, 
    logininfo,
    loading, 
    error 
  } = useData();

  // Example 1: Set data using setProps
  const handleSetData = () => {
    const newData = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'salesperson' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'admin' }
    ];
    
    // Use setProps like props.setProps({data: IISMethods.getcopy(newdata)})
    setProps({ data: IISMethods.getcopy(newData) });
    IISMethods.successmsg('Data set using setProps', 2);
  };

  // Example 2: Set form data using setProps
  const handleSetFormData = () => {
    const newFormData = [
      { field: 'fullname', value: 'John Doe' },
      { field: 'email', value: 'john@example.com' },
      { field: 'phone', value: '1234567890' },
      { field: 'role', value: 'admin' }
    ];
    
    setProps({ formdata: IISMethods.getcopy(newFormData) });
    IISMethods.successmsg('Form data set using setProps', 2);
  };

  // Example 3: Set filter data using setProps
  const handleSetFilterData = () => {
    const newFilterData = {
      status: 'active',
      role: 'admin',
      search: 'john'
    };
    
    setProps({ filterdata: IISMethods.getcopy(newFilterData) });
    IISMethods.successmsg('Filter data set using setProps', 2);
  };

  // Example 4: Set master data using setProps
  const handleSetMasterData = () => {
    const newMasterData = [
      { label: 'Admin', value: 'admin' },
      { label: 'Sales Person', value: 'salesperson' },
      { label: 'Manager', value: 'manager' }
    ];
    
    setProps({ masterdata: IISMethods.getcopy(newMasterData) });
    IISMethods.successmsg('Master data set using setProps', 2);
  };

  // Example 5: Set login info using setProps
  const handleSetLoginInfo = () => {
    const newLoginInfo = {
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
    
    setProps({ logininfo: IISMethods.getcopy(newLoginInfo) });
    IISMethods.successmsg('Login info set using setProps', 2);
  };

  // Example 6: Set pagination using setProps
  const handleSetPagination = () => {
    setProps({ 
      pageno: 2, 
      pagename: 'Users Page',
      nextpage: 1 
    });
    IISMethods.infomsg('Pagination set using setProps', 4);
  };

  // Example 7: Set multiple properties at once using setProps
  const handleSetMultipleProps = () => {
    const newData = [
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'salesperson' },
      { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'admin' }
    ];
    
    const newFormData = [
      { field: 'fullname', value: 'Alice Brown' },
      { field: 'email', value: 'alice@example.com' }
    ];
    
    const newFilterData = {
      status: 'active',
      role: 'salesperson'
    };
    
    setProps({
      data: IISMethods.getcopy(newData),
      formdata: IISMethods.getcopy(newFormData),
      filterdata: IISMethods.getcopy(newFilterData),
      pageno: 3,
      pagename: 'Multiple Props Set'
    });
    IISMethods.successmsg('Multiple properties set using setProps', 2);
  };

  // Example 8: Get current props using getProps
  const handleGetProps = () => {
    const currentProps = getProps();
    console.log('Current Props:', currentProps);
    IISMethods.infomsg('Current props logged to console', 4);
  };

  // Example 9: Set loading state using setProps
  const handleSetLoading = () => {
    setProps({ loading: true });
    IISMethods.infomsg('Loading set to true', 4);
    
    // Simulate loading and then set to false
    setTimeout(() => {
      setProps({ loading: false });
      IISMethods.successmsg('Loading set to false', 2);
    }, 2000);
  };

  // Example 10: Set error state using setProps
  const handleSetError = () => {
    setProps({ error: 'Sample error message' });
    IISMethods.errormsg('Error set using setProps', 1);
    
    // Clear error after 3 seconds
    setTimeout(() => {
      setProps({ error: null });
      IISMethods.successmsg('Error cleared', 2);
    }, 3000);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">SetProps Example</h2>
          <p className="text-muted mb-4">
            This demonstrates how to use setProps() function like props.setProps() to store data in Redux.
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
              <p><strong>Form Data Count:</strong> {formdata.length}</p>
              <p><strong>Filter Data Keys:</strong> {Object.keys(filterdata).join(', ') || 'None'}</p>
              <p><strong>Master Data Count:</strong> {masterdata.length}</p>
              <p><strong>Page No:</strong> {pageno}</p>
              <p><strong>Page Name:</strong> {pagename}</p>
              <p><strong>Next Page:</strong> {nextpage}</p>
              <p><strong>User:</strong> {logininfo?.user?.userName || 'Not logged in'}</p>
              <p><strong>Authenticated:</strong> {logininfo?.isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {error || 'None'}</p>
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

      {/* SetProps Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>SetProps Actions</h5>
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
                  <button onClick={handleSetFilterData} className="btn btn-info w-100">
                    Set Filter Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetMasterData} className="btn btn-secondary w-100">
                    Set Master Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetLoginInfo} className="btn btn-warning w-100">
                    Set Login Info
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetPagination} className="btn btn-dark w-100">
                    Set Pagination
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetMultipleProps} className="btn btn-outline-primary w-100">
                    Set Multiple Props
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetLoading} className="btn btn-outline-warning w-100">
                    Set Loading
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetError} className="btn btn-outline-danger w-100">
                    Set Error
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleGetProps} className="btn btn-outline-info w-100">
                    Get Props
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
              <h6>1. Basic Usage:</h6>
              <pre className="bg-light p-3 rounded">
{`import { setProps, getProps } from '@/utils/reduxUtils';
import IISMethods from '@/utils/IISMethods';

// Set data using setProps (like props.setProps())
const newData = [
  { id: 1, name: 'John Doe', email: 'john@example.com' }
];

setProps({ data: IISMethods.getcopy(newData) });

// Set multiple properties at once
setProps({
  data: IISMethods.getcopy(newData),
  formdata: IISMethods.getcopy(formData),
  pageno: 2,
  pagename: 'Users Page'
});

// Get current props
const currentProps = getProps();
console.log(currentProps);`}
              </pre>

              <h6 className="mt-3">2. Available Properties:</h6>
              <pre className="bg-light p-3 rounded">
{`// You can set any of these properties using setProps:
setProps({
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
  loading: false,             // Loading state
  error: null                 // Error state
});`}
              </pre>

              <h6 className="mt-3">3. Real-world Example:</h6>
              <pre className="bg-light p-3 rounded">
{`// Example: Loading data from API
const loadUserData = async () => {
  try {
    setProps({ loading: true });
    
    const response = await fetch('/api/users');
    const result = await response.json();
    
    setProps({
      data: IISMethods.getcopy(result.users),
      pageno: result.pageNo,
      nextpage: result.hasNextPage ? 1 : 0,
      loading: false
    });
    
  } catch (error) {
    setProps({
      error: error.message,
      loading: false
    });
  }
};

// Example: Form submission
const handleFormSubmit = (formData) => {
  setProps({
    formdata: IISMethods.getcopy(formData),
    loading: true
  });
  
  // Process form...
  setProps({ loading: false });
};

// Example: Login
const handleLogin = (userData, token) => {
  setProps({
    logininfo: IISMethods.getcopy({
      user: userData,
      token: token,
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    })
  });
};`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPropsExample;
