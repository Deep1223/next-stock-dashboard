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

  const fieldOrder = [
    {
      label: 'Product Name',
      field: 'productName',
      type: 'text',
      size: 'min-w-[150px]',
      sorting: true,
    },
    {
      label: 'Category',
      field: 'category',
      type: 'text',
      size: 'min-w-[150px]',
      sorting: true,
    },
    {
      label: 'Brand',
      field: 'brand',
      type: 'text',
      size: 'min-w-[150px]',
      sorting: true,
    },
    {
      label: 'Description',
      field: 'description',
      type: 'text',
      size: 'min-w-[150px]',
      sorting: true,
    },
    {
      label: 'Price',
      field: 'price',
      type: 'text',
      size: 'min-w-[150px]',
      sorting: true,
    }
  ]

  const sampleData = [
    { "id": 1, "productName": "Apple iPhone 14", "category": "Electronics", "brand": "Apple", "description": "Latest iPhone model", "price": 999 },
    { "id": 2, "productName": "Samsung Galaxy S23", "category": "Electronics", "brand": "Samsung", "description": "High-end Android phone", "price": 899 },
    { "id": 3, "productName": "Sony WH-1000XM5", "category": "Accessories", "brand": "Sony", "description": "Noise-canceling headphones", "price": 350 },
    { "id": 4, "productName": "Dell XPS 13", "category": "Computers", "brand": "Dell", "description": "Premium ultrabook", "price": 1299 },
    { "id": 5, "productName": "Nike Air Max 90", "category": "Footwear", "brand": "Nike", "description": "Classic running shoes", "price": 150 },
    { "id": 6, "productName": "Adidas Ultraboost", "category": "Footwear", "brand": "Adidas", "description": "Comfortable running shoes", "price": 180 },
    { "id": 7, "productName": "MacBook Pro 16", "category": "Computers", "brand": "Apple", "description": "Powerful laptop for professionals", "price": 2399 },
    { "id": 8, "productName": "Logitech MX Master 3", "category": "Accessories", "brand": "Logitech", "description": "Ergonomic wireless mouse", "price": 99 },
    { "id": 9, "productName": "Bose QuietComfort 45", "category": "Accessories", "brand": "Bose", "description": "Premium noise-canceling headphones", "price": 329 },
    { "id": 10, "productName": "Google Pixel 7", "category": "Electronics", "brand": "Google", "description": "Pure Android experience", "price": 799 },
    { "id": 11, "productName": "HP Spectre x360", "category": "Computers", "brand": "HP", "description": "2-in-1 convertible laptop", "price": 1499 },
    { "id": 12, "productName": "PlayStation 5", "category": "Gaming", "brand": "Sony", "description": "Next-gen gaming console", "price": 499 },
    { "id": 13, "productName": "Xbox Series X", "category": "Gaming", "brand": "Microsoft", "description": "High-performance gaming console", "price": 499 },
    { "id": 14, "productName": "Samsung 4K Smart TV", "category": "Electronics", "brand": "Samsung", "description": "Crystal clear UHD display", "price": 1200 },
    { "id": 15, "productName": "Canon EOS R6", "category": "Cameras", "brand": "Canon", "description": "Mirrorless camera for professionals", "price": 2500 }
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
    formDataToSend.append("fullname", formData.fullname);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("password", formData.password);

    try {
      const response = await fetch("https://dev.crmbackend.finnovationz.com/api/leads/uploadleads", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(Config.fileuploadsuccessfullyerror);
        setModalOpen(false);
      } else {
        toast.error(result.message || Config.fileuploadfailederror);
      }
    } catch (error) {
      toast.error(Config.errouploadingfileerror);
      console.error(error);
    }
  };

  useEffect(() => {
    setFilteredData(sampleData);
  }, []);

  const handleSearch = (searchText) => {
    if (!searchText.trim()) {
      setFilteredData(sampleData);
      return;
    }

    const lowerCaseSearch = searchText.toLowerCase();

    const filtered = sampleData.filter(item =>
      item.productName.toLowerCase().includes(lowerCaseSearch) ||
      item.category.toLowerCase().includes(lowerCaseSearch) ||
      item.brand.toLowerCase().includes(lowerCaseSearch) ||
      item.description.toLowerCase().includes(lowerCaseSearch) ||
      item.price.toString().includes(lowerCaseSearch)
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
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
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
          sampleData={sampleData}
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
