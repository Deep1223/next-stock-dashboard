'use client';

import { useState, useEffect,useCallback  } from 'react';
import Table from '@/components/Table';
import Config from '@/config/config';
import { toast } from 'react-toastify';
import validateField from '@/components/Validation';
import SearchBar from '@/components/SearchBar';
import DeleteModal from '@/components/DeleteModal';
import MasterJson from '@/config/masterJSON';
import ViewModal from '@/components/ViewModal';
import CreateModal from '@/components/CreateModal';
import { useRouter } from "next/navigation";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const Home = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [viewDetails, setViewDetails] = useState('')
  const [modalViewOpen, setModalViewOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtereddata, setFilteredData] = useState([])
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [deleteDetails, setDeleteDetails] = useState('')
  const [rightSidebarData, setRightSidebarData] = useState(MasterJson.leads)
  const [activeTab, setActiveTab] = useState(rightSidebarData[0].tabname);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const[email,setEmail]=useState(null)
  const [userRole, setUserRole] = useState(null);
  const [leadsData, setLeadsData] = useState([]);
  const [csvType, setCsvType] = useState("");
  const [leads, setLeads] = useState([]);
  const [csvList, setCsvList] = useState([]); // Stores CSV names from API
  const [selectedCsvName, setSelectedCsvName] = useState(""); // Stores selected option
  useEffect(() => {
    if (typeof window !== "undefined") { // Ensure it's running on the client
      setToken(localStorage.getItem('token'));
      setUserId(localStorage.getItem('userid'));
      setUserRole(localStorage.getItem('userrole'));
      setEmail(localStorage.getItem('userEmail'));

    }
  }, []);

  const brandOptions = [
    { value: "Apple", label: "Apple" },
    { value: "Samsung", label: "Samsung" },
    { value: "Sony", label: "Sony" },
    { value: "Dell", label: "Dell" },
    { value: "Nike", label: "Nike" },
    { value: "Adidas", label: "Adidas" },
    { value: "Microsoft", label: "Microsoft" },
    { value: "HP", label: "HP" },
    { value: "Bose", label: "Bose" },
    { value: "Canon", label: "Canon" }
  ];
  const fetchCsvList = useCallback(async () => {
    try {
      const response = await fetch(
        "https://dev.crmbackend.finnovationz.com/api/leads/getCsvlist",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch CSV list");
      }
  
      const data = await response.json();
      
      if (data && Array.isArray(data.csvLists)) {
        setCsvList(data.csvLists);
      } else {
        console.error("Invalid response format:", data);
        setCsvList([]);
      }
    } catch (error) {
      console.error("Error fetching CSV list:", error);
      setCsvList([]);
    }
  }, [token]); // ✅ Memoized to prevent re-renders
  
  const fetchAllLeads = useCallback(async () => {
    try {
      const response = await fetch("https://dev.crmbackend.finnovationz.com/api/leads/fetchAllLeads", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }
  
      const result = await response.json();
  
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Invalid data format received from API");
      }
  
      const leadsArray = result.data;
  
      if (userRole === "Administrator") {
        setLeads(leadsArray);
        setFilteredData(leadsArray);
      } else if (userRole === "sales user" && email) {
        const filteredLeads = leadsArray.filter((lead) => lead.ownerEmail === email);
        setLeads(filteredLeads);
        setFilteredData(filteredLeads);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }, [token, userRole, email]); // ✅ Memoized to prevent infinite re-renders
  
  // ✅ Fetch data when token is available
  useEffect(() => {
    if (token) {
      fetchCsvList();
      fetchAllLeads();
    }
  }, [token, fetchCsvList, fetchAllLeads]);
// ✅ Handle Select Change
const handleCsvChange = (e) => {
  const selectedName = e.target.value;
  setSelectedCsvName(selectedName);

  if (selectedName === "") {
    setFilteredData(leads); // Show all data if no selection
  } else {
    const filteredLeads = leads.filter((lead) => lead.leadSource === selectedName);
    setFilteredData(filteredLeads);
  }
};

// ✅ Fetch data when token is available

const fieldOrder = [
  { label: "Name", field: "name", type: "text", size: "min-w-[150px]", sorting: true },
  { label: "Email", field: "email", type: "text", size: "min-w-[200px]", sorting: true },
  { label: "Phone", field: "phone", type: "text", size: "min-w-[150px]", sorting: true },
  { label: "Owner Email", field: "ownerEmail", type: "text", size: "min-w-[200px]", sorting: true },
  { label: "Lead Status", field: "leadStatus", type: "text", size: "min-w-[200px]", sorting: true },
  { label: "Lead File", field: "leadSource", type: "text", size: "min-w-[200px]", sorting: true }, // ✅ Added Lead Source
];



  useEffect(() => {
    setFormData({});
    setErrors({});
    setActiveTab(rightSidebarData[0].tabname)
  }, [modalOpen]);

  // Handle input change and validate field
  const handleChange = (e, field) => {
    const { files, value } = e.target;
    const fieldValue = files ? files[0] : value;
    const errorMessage = validateField(field.text, fieldValue, { required: field.required, type: field.regextype });
    setFormData((prev) => ({ ...prev, [field.field]: fieldValue }));
    setErrors((prev) => ({ ...prev, [field.field]: errorMessage }));
  };

  // Handle form submission
  const handleAddButtonClick = async () => {
    let newErrors = {};
    let emptyFields = false;

    // Validate all fields
    rightSidebarData.forEach((tab) => {
      tab.fields.forEach((field) => {
        const fieldValue = formData[field.field] || '';
        const errorMessage = validateField(field.text, fieldValue, { required: field.required, type: field.regextype });

        if (field.required && !fieldValue) {
          emptyFields = true;
          newErrors[field.field] = Config.thisfieldrequirederror;
        } else if (errorMessage) {
          newErrors[field.field] = errorMessage;
        }
      });
    });

    // Show error toast if fields are empty
    if (emptyFields) {
      setErrors(newErrors);
      toast.error(Config.fillallfieldserror);
      return;
    }

    // Show first validation error (if any)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(Object.values(newErrors)[0]);
      return;
    }

    // Clear errors before API call
    setErrors({});

    // Prepare form data for API request
    const formDataToSend = new FormData();

    // Function to append data only if it's not undefined, null, or empty
    const appendIfValid = (key, value) => {
      if (value !== undefined && value !== null && value !== "") {
        formDataToSend.append(key, value);
      }
    };

    // **Tab 1**
    appendIfValid("file", formData?.lead);

    // **Tab 2**
    appendIfValid("mapnameid", formData?.name?.value);
    appendIfValid("mapname", formData?.name);
    appendIfValid("mapemailid", formData?.email_id?.value);
    appendIfValid("mapemail", formData?.email_id?.label);
    appendIfValid("mapownerid", formData?.owner?.value);
    appendIfValid("mapowner", formData?.owner?.label);
    appendIfValid("mapsourceid", formData?.lead_source?.value);
    appendIfValid("mapsource", formData?.lead_source?.label);
    appendIfValid("mapphonenumberid", formData?.phone_number?.value);
    appendIfValid("mapphonenumber", formData?.phone_number?.label);

    // **Tab 3**
    appendIfValid("handlingduplicateleadrecords", formData?.handlingduplicateleadrecords);
    appendIfValid("donotcreatenewleads", formData?.mandatory?.donotcreatenewleads);
    appendIfValid("donotupdateownerofexistingleads", formData?.mandatory?.donotupdateownerofexistingleads);
    appendIfValid("importonlyifvalidphonenumberexistsinCSV", formData?.mandatory?.importonlyifvalidphonenumberexistsinCSV);
    appendIfValid("leadowner", formData?.leadowner?.label);
    appendIfValid("leadownerid", formData?.leadowner?.value);
    appendIfValid("ownerEmail", formData?.ownerEmail);

    // **Add to List Selection**
    const selectedAddToList = rightSidebarData?.flatMap(tab =>
      tab.fields.find(field => field.field === "addtolist")?.options?.find(opt => opt.value === formData?.addtolist)
    ).filter(item => item !== undefined)[0];

    appendIfValid("status", selectedAddToList?.value);
    // appendIfValid("status", selectedAddToList?.label);

    if (formData?.addtolist === '0') {
      appendIfValid("csvName", formData?.listname);
      appendIfValid("csvDescription", formData?.listdescription);
    } else if (formData?.addtolist === '1') {
      appendIfValid("csvId", formData?.listname?.value);
      // appendIfValid("csvId", formData?.listname?.value);
    }

    appendIfValid("leadsource", formData?.leadsource);
    appendIfValid("importsummarynote", formData?.importsummarynote);
    appendIfValid("leadstatus", '1');  // 1 = active

    // **Tab 4**
    appendIfValid("sendmail", formData?.sendmail);

    try {
      const response = await fetch("https://dev.crmbackend.finnovationz.com/api/leads/uploadleads", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(Config.fileuploadsuccessfullyerror);
        setModalOpen(false);
        fetchAllLeads()
      } else {
        toast.error(result.message || Config.fileuploadfailederror);
      }
    } catch (error) {
      toast.error(Config.errouploadingfileerror);
      console.error(error);
    }
  };

  useEffect(() => {
    setFilteredData(leads);
  }, [leads]);

  const handleSearch = (searchText) => {
    if (!searchText.trim()) {
      setFilteredData(leads);
      return;
    }

    const lowerCaseSearch = searchText.toLowerCase();

    const filtered = leads.filter(item =>
      item.name.toLowerCase().includes(lowerCaseSearch) ||
      item.email.toLowerCase().includes(lowerCaseSearch) ||
      item.phone.toLowerCase().includes(lowerCaseSearch) ||
      item.ownerEmail.toLowerCase().includes(lowerCaseSearch) ||
      item.leadStatus.toLowerCase().includes(lowerCaseSearch)
    );
    

    setFilteredData(filtered);
  };

  const handleleadstatusChange = (value) => {
    console.log('handleleadstatus', event.target.value);
  }

  const handleleads = (id) => {
    console.log('handleleads', id);

    router.push(`/manageleads/${id}`);
  }

  try {
    return (
      <>
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4">
          <h1 className="text-[22px] font-medium text-gray-800 tracking-wider">Lead Management</h1>
          <div className="flex items-center gap-2">
            {/* CSV Type Select */}
            <select
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-300"
        value={selectedCsvName}
        onChange={handleCsvChange}
      >
        <option value="">Select CSV Type</option>
        {csvList.length > 0 ? (
          csvList.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))
        ) : (
          <option disabled>No CSVs available</option>
        )}
      </select>
            <SearchBar
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
              handleSearch={handleSearch}
            />
            {userRole === "Administrator" && (
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
    onClick={() => setModalOpen(true)}
  >
    {Config.createbtn}
  </button>
)}

          </div>
        </div>

        {/* Table Component */}
        <Table
        
          invisibleEdit={true}
          showleads={true}
          setViewDetails={setViewDetails}
          setModalViewOpen={setModalViewOpen}
          filtereddata={filtereddata}
          setModalDeleteOpen={setModalDeleteOpen}
          setDeleteDetails={setDeleteDetails}
          fieldOrder={fieldOrder}
         
          brandOptions={brandOptions}
          handleleadstatusChange={handleleadstatusChange}
          handleleads={handleleads}
        />

        <CreateModal
          title={'Create Lead'}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          rightSidebarData={rightSidebarData}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          errors={errors}
          handleChange={handleChange}
          formData={formData}
          handleAddButtonClick={handleAddButtonClick}
          // handleNextButtonClick={handleNextButtonClick}
          setErrors={setErrors}
          token={token}
        />

        <ViewModal
          modalViewOpen={modalViewOpen}
          setModalViewOpen={setModalViewOpen}
          viewDetails={viewDetails}
          title={'Lead Detail'}
          fieldOrder={fieldOrder}
        />

        <DeleteModal
          setModalDeleteOpen={setModalDeleteOpen}
          modalDeleteOpen={modalDeleteOpen}
        />
      </>
    );
  }
  catch (e) {
    console.log(e);
    return <></>;
  }
};

export default Home;