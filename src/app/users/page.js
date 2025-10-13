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
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Modal from '@/components/modal';

const Users = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
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
  // Static user data - 10 users
  const staticUsers = [
    {
      _id: "1",
      userName: "John Doe",
      userEmail: "john.doe@example.com",
      userPhoneNumber: "+1-555-0123",
      userRole: "Administrator",
      userStatus: "Active",
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      _id: "2",
      userName: "Jane Smith",
      userEmail: "jane.smith@example.com",
      userPhoneNumber: "+1-555-0124",
      userRole: "Manager",
      userStatus: "Active",
      createdAt: "2024-01-16T09:15:00Z"
    },
    {
      _id: "3",
      userName: "Mike Johnson",
      userEmail: "mike.johnson@example.com",
      userPhoneNumber: "+1-555-0125",
      userRole: "User",
      userStatus: "Active",
      createdAt: "2024-01-17T14:20:00Z"
    },
    {
      _id: "4",
      userName: "Sarah Wilson",
      userEmail: "sarah.wilson@example.com",
      userPhoneNumber: "+1-555-0126",
      userRole: "Manager",
      userStatus: "Inactive",
      createdAt: "2024-01-18T11:45:00Z"
    },
    {
      _id: "5",
      userName: "David Brown",
      userEmail: "david.brown@example.com",
      userPhoneNumber: "+1-555-0127",
      userRole: "User",
      userStatus: "Active",
      createdAt: "2024-01-19T16:30:00Z"
    },
    {
      _id: "6",
      userName: "Emily Davis",
      userEmail: "emily.davis@example.com",
      userPhoneNumber: "+1-555-0128",
      userRole: "Administrator",
      userStatus: "Active",
      createdAt: "2024-01-20T08:15:00Z"
    },
    {
      _id: "7",
      userName: "Robert Miller",
      userEmail: "robert.miller@example.com",
      userPhoneNumber: "+1-555-0129",
      userRole: "User",
      userStatus: "Active",
      createdAt: "2024-01-21T13:25:00Z"
    },
    {
      _id: "8",
      userName: "Lisa Garcia",
      userEmail: "lisa.garcia@example.com",
      userPhoneNumber: "+1-555-0130",
      userRole: "Manager",
      userStatus: "Active",
      createdAt: "2024-01-22T10:10:00Z"
    },
    {
      _id: "9",
      userName: "James Martinez",
      userEmail: "james.martinez@example.com",
      userPhoneNumber: "+1-555-0131",
      userRole: "User",
      userStatus: "Inactive",
      createdAt: "2024-01-23T15:40:00Z"
    },
    {
      _id: "10",
      userName: "Jennifer Anderson",
      userEmail: "jennifer.anderson@example.com",
      userPhoneNumber: "+1-555-0132",
      userRole: "Administrator",
      userStatus: "Active",
      createdAt: "2024-01-24T12:05:00Z"
    }
  ];

  const [users, setUsers] = useState(staticUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLeads, setUserLeads] = useState('');
  const [modalUserDetailsOpen, setModalUserDetailsOpen] = useState(false);
  const [userLeadDetails, setUserLeadDetails] = useState('');
  const [userDetails, setUserDetails] = useState('');

  useEffect(() => {
    if (typeof window !== "undefined") { // Ensure it's running on the client
      setToken(localStorage.getItem('token'));
      setUserId(localStorage.getItem('userid'));
      setUserRole(localStorage.getItem('userrole'));
    }
  }, []);
  const fieldOrder = [
    { label: 'User Name', field: 'userName', type: 'text', size: '', sorting: true },
    { label: 'Email', field: 'userEmail', type: 'text', size: '', sorting: true },
    { label: 'Phone Number', field: 'userPhoneNumber', type: 'text', size: '', sorting: true },
    { label: 'Role', field: 'userRole', type: 'text', size: '', sorting: true },
    // { label: 'Actions', field: 'actions', type: 'custom', size: '', render: (row) => (
    //   <button onClick={() => handleEditClick(row)} className="btn btn-primary">Edit</button>
    // )}
  ];


  // Reset form data and errors when modal opens/closes
  useEffect(() => {
    setFormData({});
    setErrors({});
    setActiveTab(rightSidebarData[0].tabname)
  }, [modalOpen]);
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({ userRole: user.userRole, password: '' });
    setEditModalOpen(true);
  };
  // Handle input change and validate field
  const handleChange = (e, field) => {
    const { files, value } = e.target;
    const fieldValue = files ? files[0] : value;


    setFormData((prev) => ({
      ...prev,
      [field.field]: fieldValue,
    }));
  };
  const handleChangeedit = (e) => {
    const { name, files, value } = e.target;
    const fieldValue = files ? files[0] : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,  // ✅ Use `name` instead of `field.field`
    }));
  };

  // Initialize with static data
  useEffect(() => {
    setUsers(staticUsers);
    setFilteredData(staticUsers);
  }, []);
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


    // Add new user to static data
    const newUser = {
      _id: (users.length + 1).toString(),
      ...formattedData,
      userStatus: "Active",
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setFilteredData(updatedUsers);
    
    toast.success("User registered successfully!");
    setModalOpen(false);
  };

  useEffect(() => {
    setFilteredData(users);
  }, [users]);

  const handleUpdate = async () => {
    if (!formData.userRole || !formData.password) {
      toast.error("Role and Password are required!");
      return;
    }

    const updateData = {
      userRole: formData.userRole,
      userPassword: formData.password
    };

    // Update user in static data
    const updatedUsers = users.map(user => 
      user._id === selectedUser._id 
        ? { ...user, ...updateData }
        : user
    );
    
    setUsers(updatedUsers);
    setFilteredData(updatedUsers);
    
    toast.success("User updated successfully!");
    setEditModalOpen(false);
  };

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
  const handleUserDetails = (data) => {
    setUserDetails(data);

    if (data.userEmail) {
      const userLeadsData = userLeads.filter(lead => lead.ownerEmail === data.userEmail);
      setUserLeadDetails(userLeadsData);
      setModalUserDetailsOpen(true);
    }
  };

  const tableFields = [
    { label: "Name", field: "name", size: "min-w-[150px]", maxWidth: "max-w-[350px]" },
    { label: "Email", field: "email", size: "min-w-[150px]", maxWidth: "max-w-[350px]" },
    { label: "Phone", field: "phone", size: "min-w-[150px]", maxWidth: "max-w-[350px]" },
    { label: "Owner Email", field: "ownerEmail", size: "min-w-[150px]", maxWidth: "max-w-[350px]" },
    { label: "Lead Status", field: "leadStatus", size: "min-w-[150px]", maxWidth: "max-w-[350px]" },
    { label: "Lead Source", field: "leadSource", size: "min-w-[150px]", maxWidth: "max-w-[350px]" },
  ]

  try {
    return (
      <>
        {/* Page Header */}
        <div className="d-flex align-items-center justify-content-between pb-4">
          <h1 className="h4 fw-medium text-dark">{rightSidebarData[0].pagename}</h1>
          <div className="d-flex align-items-center gap-2">
            <SearchBar
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
              handleSearch={handleSearch}
            />
            <button
              className="btn btn-primary"
              onClick={() => setModalOpen(true)}
            >
              {Config.createbtn}
            </button>
          </div>
        </div>

        {/* Table Component */}
        <Table
          invisibleEdit={true}
          invisibleDelete={true}
          showdetails={true}
          setViewDetails={setViewDetails}
          setModalViewOpen={setModalViewOpen}
          filtereddata={filtereddata}
          setModalDeleteOpen={setModalDeleteOpen}
          setDeleteDetails={setDeleteDetails}
          fieldOrder={fieldOrder}
          setUserDetails={setUserDetails}
          handleUserDetails={handleUserDetails}
        />
        {editModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <label className="block mb-2">Role</label>
              <select name="userRole" value={formData.userRole} onChange={handleChangeedit} className="w-full p-2 border rounded">
                <option value="Administrator">Administrator</option>
                <option value="sales user">Sales User</option>
                <option value="User">User</option>
              </select>

              <label className="block mt-4 mb-2">New Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChangeedit} className="w-full p-2 border rounded" />

              <div className="flex justify-end mt-4 space-x-2">
                <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded">Update</button>
              </div>
            </div>
          </div>
        )}
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

        <Modal
          open={modalUserDetailsOpen}
          onClose={() => setModalUserDetailsOpen(false)}
          header={<h2 className="text-lg font-semibold">{`Leads (${userDetails.userName}) [${userLeadDetails.length}]`}</h2>}
          width="w-4/5"
          body={
            <div className="bg-white relative shadow-md sm:rounded-sm overflow-hidden">
              <div className="overflow-x-auto flex-grow">
                <div className="overflow-x-auto overflow-y-auto table-content bg-white shadow-lg sm:rounded-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <table className="text-sm text-left text-gray-700 w-full">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 border-b">
                      <tr>
                        {tableFields.map((field, index) => (
                          <th key={index} className={`px-4 py-3 ${field.size}`}>
                            <div className="flex justify-between items-center w-full">
                              <span>{field.label}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {userLeadDetails.length > 0 ? (
                        userLeadDetails.map((formData, index) => (
                          <tr key={index} className="border-b even:bg-gray-50 hover:bg-gray-100 transition relative">
                            {tableFields.map((field, index) => (
                              <td key={index} className={`p-3 ${field.maxWidth} overflow-hidden whitespace-nowrap text-ellipsis`}>
                              {formData[field.field] ? formData[field.field] : '-'}
                            </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={tableFields.length} className="text-center p-5">
                            <img src={"/No_Data_Found.svg"} alt={"No Data Found"} className="mx-auto h-[300px]" />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          }
          footer={
            <button
              onClick={() => setModalUserDetailsOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Close
            </button>
          }
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
