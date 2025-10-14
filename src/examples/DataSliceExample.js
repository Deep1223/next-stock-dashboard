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
  clearData,
  clearFormData,
  clearFilterData
} from '@/store/reducer';
import { 
  getData,
  getRightSidebarFormData,
  getFormData,
  getFilterData,
  getMasterData,
  getMasterDataListing,
  getPageNo,
  getPageName,
  getNextPage,
  setData as setDataUtil,
  setRightSidebarFormData as setRightSidebarFormDataUtil,
  setFormData as setFormDataUtil,
  setFilterData as setFilterDataUtil,
  setMasterData as setMasterDataUtil,
  setMasterDataListing as setMasterDataListingUtil,
  setPageNo as setPageNoUtil,
  setPageName as setPageNameUtil,
  setNextPage as setNextPageUtil
} from '@/utils/reduxUtils';
import MasterJson from '@/config/masterJSON';
import IISMethods from '@/utils/IISMethods';
import Config from '@/config/config';

/**
 * Data Slice Usage Example Component
 * Demonstrates how to use the new data slice in Redux
 */
const DataSliceExample = () => {
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
    loading, 
    error, 
    dispatch 
  } = useData();

  // Load master JSON data on component mount
  useEffect(() => {
    // Set right sidebar form data from master JSON
    if (MasterJson.leads && MasterJson.leads.length > 0) {
      dispatch(setRightSidebarFormData(MasterJson.leads[0].fields));
    }
    
    // Set page name
    dispatch(setPageName('Data Slice Example'));
  }, [dispatch]);

  // Example 1: Set main data (API data or localStorage gridlist data)
  const handleSetData = () => {
    const sampleData = [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' }
    ];
    
    dispatch(setData(sampleData));
    IISMethods.successmsg('Data set successfully', 2);
  };

  // Example 2: Set right sidebar form data from master JSON
  const handleSetRightSidebarFormData = () => {
    if (MasterJson.users && MasterJson.users.length > 0) {
      dispatch(setRightSidebarFormData(MasterJson.users[0].fields));
      IISMethods.successmsg('Right sidebar form data set from master JSON', 2);
    } else {
      IISMethods.warningmsg('No user fields found in master JSON', 3);
    }
  };

  // Example 3: Set form data (right sidebar fields value)
  const handleSetFormData = () => {
    const sampleFormData = {
      fullname: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      role: 'admin',
      password: 'password123'
    };
    
    dispatch(setDataFormData(sampleFormData));
    IISMethods.successmsg('Form data set successfully', 2);
  };

  // Example 4: Set filter data (same as form data structure)
  const handleSetFilterData = () => {
    const sampleFilterData = {
      status: 'Active',
      role: 'admin',
      search: 'john'
    };
    
    dispatch(setFilterData(sampleFilterData));
    IISMethods.successmsg('Filter data set successfully', 2);
  };

  // Example 5: Set master data (API data in label and value array of object)
  const handleSetMasterData = () => {
    const sampleMasterData = {
      roles: [
        { label: 'Admin', value: 'admin' },
        { label: 'Sales Person', value: 'salesperson' },
        { label: 'Manager', value: 'manager' }
      ],
      statuses: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' }
      ]
    };
    
    dispatch(setMasterData(sampleMasterData));
    IISMethods.successmsg('Master data set successfully', 2);
  };

  // Example 6: Set master data listing (store API data)
  const handleSetMasterDataListing = () => {
    const sampleMasterDataListing = [
      { _id: '1', name: 'Admin Role', type: 'role' },
      { _id: '2', name: 'Sales Role', type: 'role' },
      { _id: '3', name: 'Active Status', type: 'status' },
      { _id: '4', name: 'Inactive Status', type: 'status' }
    ];
    
    dispatch(setMasterDataListing(sampleMasterDataListing));
    IISMethods.successmsg('Master data listing set successfully', 2);
  };

  // Example 7: Set page number
  const handleSetPageNo = () => {
    const newPageNo = pageno + 1;
    dispatch(setPageNo(newPageNo));
    IISMethods.infomsg(`Page number set to: ${newPageNo}`, 4);
  };

  // Example 8: Set page name
  const handleSetPageName = () => {
    const newPageName = 'Updated Page Name';
    dispatch(setPageName(newPageName));
    IISMethods.infomsg(`Page name set to: ${newPageName}`, 4);
  };

  // Example 9: Set next page availability
  const handleSetNextPage = () => {
    const newNextPage = nextpage === 1 ? 0 : 1;
    dispatch(setNextPage(newNextPage));
    IISMethods.infomsg(`Next page availability set to: ${newNextPage}`, 4);
  };

  // Example 10: Clear data
  const handleClearData = () => {
    dispatch(clearData());
    IISMethods.warningmsg('Data cleared', 3);
  };

  // Example 11: Clear form data
  const handleClearFormData = () => {
    dispatch(clearFormData());
    IISMethods.warningmsg('Form data cleared', 3);
  };

  // Example 12: Clear filter data
  const handleClearFilterData = () => {
    dispatch(clearFilterData());
    IISMethods.warningmsg('Filter data cleared', 3);
  };

  // Example 13: Using utility functions
  const handleGetCurrentData = () => {
    const currentData = getData();
    const currentFormData = getFormData();
    const currentFilterData = getFilterData();
    const currentMasterData = getMasterData();
    const currentPageNo = getPageNo();
    const currentPageName = getPageName();
    const currentNextPage = getNextPage();
    
    console.log('Current Data State:', {
      data: currentData,
      formdata: currentFormData,
      filterdata: currentFilterData,
      masterdata: currentMasterData,
      pageno: currentPageNo,
      pagename: currentPageName,
      nextpage: currentNextPage
    });
    
    IISMethods.infomsg('Current data state logged to console', 4);
  };

  // Example 14: Using utility functions to set data
  const handleSetDataWithUtils = () => {
    setDataUtil([{ id: 1, name: 'Utility Data', email: 'utility@example.com' }]);
    setFormDataUtil({ name: 'Utility Form Data' });
    setFilterDataUtil({ status: 'utility' });
    setPageNoUtil(5);
    setPageNameUtil('Utility Page');
    setNextPageUtil(1);
    
    IISMethods.successmsg('Data set using utility functions', 2);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Data Slice Usage Examples</h2>
          <p className="text-muted mb-4">
            This component demonstrates how to use the new data slice in Redux with the exact structure you specified.
          </p>
        </div>
      </div>

      {/* Current State Display */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Current Data State</h5>
            </div>
            <div className="card-body">
              <p><strong>Data Count:</strong> {data.length}</p>
              <p><strong>Right Sidebar Form Data Count:</strong> {rightsidebarformdata.length}</p>
              <p><strong>Form Data Keys:</strong> {Object.keys(formdata).join(', ') || 'None'}</p>
              <p><strong>Filter Data Keys:</strong> {Object.keys(filterdata).join(', ') || 'None'}</p>
              <p><strong>Master Data Keys:</strong> {Object.keys(masterdata).join(', ') || 'None'}</p>
              <p><strong>Master Data Listing Count:</strong> {masterdatalisting.length}</p>
              <p><strong>Page No:</strong> {pageno}</p>
              <p><strong>Page Name:</strong> {pagename}</p>
              <p><strong>Next Page:</strong> {nextpage}</p>
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

      {/* Data Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Data Slice Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetData} className="btn btn-primary w-100">
                    Set Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetRightSidebarFormData} className="btn btn-primary w-100">
                    Set Right Sidebar Form Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetFormData} className="btn btn-success w-100">
                    Set Form Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetFilterData} className="btn btn-success w-100">
                    Set Filter Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetMasterData} className="btn btn-info w-100">
                    Set Master Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetMasterDataListing} className="btn btn-info w-100">
                    Set Master Data Listing
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetPageNo} className="btn btn-warning w-100">
                    Set Page No
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetPageName} className="btn btn-warning w-100">
                    Set Page Name
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleSetNextPage} className="btn btn-warning w-100">
                    Set Next Page
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleClearData} className="btn btn-danger w-100">
                    Clear Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleClearFormData} className="btn btn-danger w-100">
                    Clear Form Data
                  </button>
                </div>
                <div className="col-md-3 col-sm-6">
                  <button onClick={handleClearFilterData} className="btn btn-danger w-100">
                    Clear Filter Data
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
                <div className="col-md-6">
                  <button onClick={handleGetCurrentData} className="btn btn-outline-primary w-100">
                    Get Current Data State
                  </button>
                </div>
                <div className="col-md-6">
                  <button onClick={handleSetDataWithUtils} className="btn btn-outline-success w-100">
                    Set Data with Utils
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
              <h6>1. Using Data Slice Hook:</h6>
              <pre className="bg-light p-3 rounded">
{`import { useData } from '@/store/hooks';

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
  dispatch 
} = useData();`}
              </pre>

              <h6 className="mt-3">2. Using Data Actions:</h6>
              <pre className="bg-light p-3 rounded">
{`import { 
  setData,
  setRightSidebarFormData,
  setFormData,
  setFilterData,
  setMasterData,
  setMasterDataListing,
  setPageNo,
  setPageName,
  setNextPage
} from '@/store/reducer';

// Set data
dispatch(setData(apiData));

// Set right sidebar form data from master JSON
dispatch(setRightSidebarFormData(MasterJson.leads[0].fields));

// Set form data
dispatch(setDataFormData({ name: 'John', email: 'john@example.com' }));

// Set filter data
dispatch(setFilterData({ status: 'Active', role: 'admin' }));

// Set master data (label and value array)
dispatch(setMasterData({
  roles: [{ label: 'Admin', value: 'admin' }]
}));

// Set master data listing
dispatch(setMasterDataListing(apiData));

// Set pagination
dispatch(setPageNo(2));
dispatch(setPageName('Users Page'));
dispatch(setNextPage(1));`}
              </pre>

              <h6 className="mt-3">3. Using Utility Functions:</h6>
              <pre className="bg-light p-3 rounded">
{`import { 
  getData,
  getFormData,
  getFilterData,
  getMasterData,
  getPageNo,
  getPageName,
  getNextPage,
  setData,
  setFormData,
  setPageNo
} from '@/utils/reduxUtils';

// Get current state
const currentData = getData();
const currentFormData = getFormData();
const currentPageNo = getPageNo();

// Set data using utilities
setData(apiData);
setFormData({ name: 'John' });
setPageNo(3);`}
              </pre>

              <h6 className="mt-3">4. Data Structure:</h6>
              <pre className="bg-light p-3 rounded">
{`// Redux State Structure:
{
  data: [],                    // Store API data or localStorage gridlist data
  rightsidebarformdata: [],    // Set rightsidebarformdata for rightsidebar field set from masterjson
  formdata: {},               // Set rightsidebar fields value in formdata
  filterdata: {},             // Set filter rightsidebar value same as formdata
  masterdata: {},             // Store API data in label and value array of object
  masterdatalisting: [],      // Store API data
  pageno: 1,                  // Set current page no
  pagename: '',               // Set current page name
  nextpage: 0                 // (1 and 0) if more data available so 1 else 0
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSliceExample;
