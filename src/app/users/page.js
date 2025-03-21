'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import Config from '@/config/config';
import { toast } from 'react-toastify';
import validateField from '@/components/Validation';
import SearchBar from '@/components/SearchBar';
import DeleteModal from '@/components/DeleteModal';
import MasterJson from '@/config/masterJSON';
import ViewModal from '@/components/ViewModal';
import CreateModal from '@/components/CreateModal';

const Users = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [viewDetails, setViewDetails] = useState('')
  const [modalViewOpen, setModalViewOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtereddata, setFilteredData] = useState([])
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [deleteDetails, setDeleteDetails] = useState('')
  const [rightSidebarData, setRightSidebarData] = useState(MasterJson.users)
  const [activeTab, setActiveTab] = useState(rightSidebarData[0].tabname);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (typeof window !== "undefined") { // Ensure it's running on the client
      setToken(localStorage.getItem('token'));
      setUserId(localStorage.getItem('userid'));
      setUserRole(localStorage.getItem('userrole'));
    }
  }, []);
  const fieldOrder = [
    {
      label: 'User Name',
      field: 'userName',
      type: 'text',
      size: 'min-w-[150px]',
      sorting: true,
    },
    {
      label: 'Email',
      field: 'userEmail',
      type: 'text',
      size: 'min-w-[200px]',
      sorting: true,
    },
    {
      label: 'Phone Number',
      field: 'userPhoneNumber',
      type: 'text',
      size: 'min-w-[150px]',
      sorting: true,
    },
    {
      label: 'Role',
      field: 'userRole',
      type: 'text',
      size: 'min-w-[150px]',
      sorting: true,
    }
];

 
  // Reset form data and errors when modal opens/closes
  useEffect(() => {
    setFormData({});
    setErrors({});
    setActiveTab(rightSidebarData[0].tabname)
  }, [modalOpen]);

  // Handle input change and validate field
  const handleChange = (e, field) => {
    const { files, value } = e.target;
    const fieldValue = files ? files[0] : value;
  
  
    setFormData((prev) => ({
      ...prev,
      [field.field]: fieldValue,
    }));
  };
  
  
  const fetchUsers = async () => {
    try {
      const response = await fetch("https://dev.crmbackend.finnovationz.com/api/users/getAllUsers", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
  
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  // Fetch users when token changes
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]); 

  // Handle form submission
  const handleAddButtonClick = async () => {
    let newErrors = {};
    let emptyFields = false;
    let tempData = { ...formData }; // Copy existing form data
  
    rightSidebarData.forEach((tab) => {
      tab.fields.forEach((field) => {
        const fieldValue = formData[field.field] || "";
        const errorMessage = validateField(field.text, fieldValue, { required: field.required, type: field.regextype });
  
        if (field.required && !fieldValue) {
          emptyFields = true;
          newErrors[field.field] = "This field is required";
        } else if (errorMessage) {
          newErrors[field.field] = errorMessage;
        }
  
        tempData[field.field] = fieldValue;
      });
    });
  
    if (emptyFields) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(Object.values(newErrors)[0]);
      return;
    }
  
    // **Convert data to match backend field names**
    const getMappedRole = (roleLabel) => {
        const roleMap = {
          "Admin": "Administrator",
          "Sales Person": "sales user"
        };
        return roleMap[roleLabel] || roleLabel; // Default to the same label if not found
      };
      
      const formattedData = {
        userName: tempData.fullname,
        userEmail: tempData.email,
        userPassword: tempData.password,
        userPhoneNumber: tempData.phone,
        userRole: getMappedRole(tempData.role.label), // Convert role label using the mapping function
      };
  
  
    try {
      const response = await fetch("https://dev.crmbackend.finnovationz.com/api/users/signup", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedData),
      });
  
      const result = await response.json();
      if (response.ok) {
        toast.success("User registered successfully!");
        setModalOpen(false);
        fetchUsers();
      } else {
        toast.error(result.message || "Failed to register user.");
      }
    } catch (error) {
      toast.error("Error uploading data.");
      console.error(error);
    }
  };
  
  

  useEffect(() => {
    setFilteredData(users);
  }, [users]);  // ✅ Ensure filtered data updates when users change
  

  const handleSearch = (searchText) => {
    if (!searchText.trim()) {
      setFilteredData(users);
      return;
    }

    const lowerCaseSearch = searchText.toLowerCase();

    const filtered = users.filter(item =>
      item.userName.toLowerCase().includes(lowerCaseSearch) ||
      item.userEmail.toLowerCase().includes(lowerCaseSearch) ||
      item.userPhoneNumber.toString().includes(lowerCaseSearch) ||
      item.userRole.toLowerCase().includes(lowerCaseSearch)
    );
    
    setFilteredData(filtered);
  };

  try {
    return (
      <>
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4">
          <h1 className="text-[22px] font-medium text-gray-800 tracking-wider">{rightSidebarData[0].pagename}</h1>
          <div className="flex items-center gap-2">
            <SearchBar
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
              handleSearch={handleSearch}
            />
            <button
              className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              onClick={() => setModalOpen(true)}
            >
              {Config.createbtn}
            </button>
          </div>
        </div>

        {/* Table Component */}
        <Table
          invisibleEdit={true}
          setViewDetails={setViewDetails}
          setModalViewOpen={setModalViewOpen}
          filtereddata={filtereddata}
          sampleData={users}
          setModalDeleteOpen={setModalDeleteOpen}
          setDeleteDetails={setDeleteDetails}
          fieldOrder={fieldOrder}
        />

        <CreateModal
          title={`Create ${rightSidebarData[0].pagename}`}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          rightSidebarData={rightSidebarData}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          errors={errors}
          handleChange={handleChange}
          formData={formData}
          handleAddButtonClick={handleAddButtonClick}
          setErrors={setErrors}
        />

        <ViewModal
          modalViewOpen={modalViewOpen}
          setModalViewOpen={setModalViewOpen}
          viewDetails={viewDetails}
          title={`${rightSidebarData[0].pagename} Detail`}
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

export default Users;


// 'use client'

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const router = useRouter();

//   // Fetch users from the API
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch("/api/users"); // Update with actual API endpoint
//         const data = await response.json();
//         setUsers(data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <div className="p-6 bg-white shadow-md rounded-lg">
//       {/* Header with "Create User" Button */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Users List</h1>
//         <button
//           onClick={() => router.push("/createuser")}
//           className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg"
//         >
//           Create User
//         </button>
//       </div>

//       {/* Users Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse border border-gray-100">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2 text-left">ID</th>
//               <th className="border p-2 text-left">Full Name</th>
//               <th className="border p-2 text-left">Email</th>
//               <th className="border p-2 text-left">Phone</th>
//               <th className="border p-2 text-left">Role</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <tr key={user.id} className="hover:bg-gray-50">
//                   <td className="border p-2">{user.id}</td>
//                   <td className="border p-2">{user.fullName}</td>
//                   <td className="border p-2">{user.email}</td>
//                   <td className="border p-2">{user.phone}</td>
//                   <td className="border p-2">{user.role}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="border p-2 text-center text-gray-500">
//                   No users found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Users;
