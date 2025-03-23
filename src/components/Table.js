import { useState, useEffect, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";
import { TbGridDots } from "react-icons/tb";
import { FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";
import { AiOutlineFileAdd } from "react-icons/ai";
import { FaAngleDown, FaAngleUp, FaX } from 'react-icons/fa6';

const Table = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const dropdownRef = useRef(null);

    const [sortState, setSortState] = useState({});
    const [sortedData, setSortedData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(null);
        }
    };

    // Initialize sortedData from filtereddata
    useEffect(() => {
        setSortedData(props.filtereddata || []);
    }, [props.filtereddata]);

    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    const toggleSort = (fieldName) => {
        // Toggle sorting state for the given field
        setSortState((prev) => ({
            ...prev,
            [fieldName]: prev[fieldName] === "asc" ? "desc" : "asc",
        }));

        // Create a copy and sort it based on the fieldName.
        const sorted = [...sortedData].sort((a, b) => {
            // Convert values to lowercase for case-insensitive sorting
            const valA = a[fieldName].toLowerCase();
            const valB = b[fieldName].toLowerCase();

            if (valA < valB) return sortState[fieldName] === "asc" ? -1 : 1;
            if (valA > valB) return sortState[fieldName] === "asc" ? 1 : -1;
            return 0;
        });

        setSortedData(sorted);
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    try {
        return (
            <section>
                <div className="bg-white relative shadow-md sm:rounded-sm overflow-hidden">
                    <div className="overflow-x-auto flex-grow">
                        <div className="overflow-x-auto overflow-y-auto table-content bg-white shadow-lg sm:rounded-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <table className="text-sm text-left text-gray-700 w-full">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-200 border-b">
                                    <tr>
                                        <th className="px-4 py-3 w-[30px] text-center">
                                            <div className="flex justify-center items-center">
                                                <TbGridDots className="text-gray-600 text-lg" />
                                            </div>
                                        </th>
                                        {props.fieldOrder.map((field, index) => (
                                            <th
                                                key={index}
                                                className={`px-4 py-3 ${field.size} cursor-pointer`}
                                                onClick={field.sorting ? () => toggleSort(field.field) : undefined}
                                            >
                                                <div className="flex justify-between items-center w-full">
                                                    <span>{field.label}</span>
                                                    {field.sorting && (
                                                        <>
                                                            {sortState[field.field] === "asc" ? (
                                                                <FaSortAmountDown />
                                                            ) : (
                                                                <FaSortAmountDownAlt />
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedData.length > 0 ? (
                                        sortedData.map((formData, index) => (
                                            <tr
                                                key={index}
                                                className="border-b even:bg-gray-50 hover:bg-gray-100 transition relative"
                                            >
                                                <td className="p-3 w-[30px] text-center relative">
                                                    <button
                                                        onClick={() => toggleDropdown(index)}
                                                        className="px-3 py-1 text-gray-600 hover:text-gray-800 focus:outline-none cursor-pointer"
                                                    >
                                                        <BsThreeDotsVertical />
                                                    </button>
                                                    {dropdownOpen === index && (
                                                        <div
                                                            ref={dropdownRef}
                                                            className="absolute right-[-120px] top-8 bg-white shadow-lg rounded-lg border w-37 z-10"
                                                        >
                                                            <ul className="py-2 text-sm text-gray-700">
                                                                {!props.invisibleEdit && (
                                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                                                                        <FaRegEdit /> Edit
                                                                    </li>
                                                                )}
                                                                {!props.invisibleDelete && (
                                                                    <li
                                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                                        onClick={async () => {
                                                                            await props.setDeleteDetails(formData.id);
                                                                            setDropdownOpen(null);
                                                                            await props.setModalDeleteOpen(true);
                                                                        }}
                                                                    >
                                                                        <RiDeleteBin6Line /> Delete
                                                                    </li>
                                                                )}
                                                                {!props.invisibleView && (
                                                                    <li
                                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                                        onClick={async () => {
                                                                            await props.setViewDetails(formData);
                                                                            setDropdownOpen(null);
                                                                            await props.setModalViewOpen(true);
                                                                        }}
                                                                    >
                                                                        <IoEyeOutline /> View
                                                                    </li>
                                                                )}
                                                                {props.showleads && (
                                                                    <li
                                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                                        onClick={async () => {
                                                                            props.handleleads(formData.id);
                                                                            setDropdownOpen(null);
                                                                        }}
                                                                    >
                                                                        <AiOutlineFileAdd /> Show Leads
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </td>
                                                {props.fieldOrder.map((field, index) => (
                                                    <td key={index} className={`p-3 ${field.size}`}>
                                                        {
                                                            field.type === "text" ? (
                                                                field.field === "price" ? (
                                                                    <span>{formData[field.field] ? `$${formData[field.field]}` : '-'}</span>
                                                                ) : (
                                                                    <span>{formData[field.field] ? formData[field.field] : '-'}</span>
                                                                )
                                                            )
                                                                : field.type === "select" ? (
                                                                    <div className="relative w-full">
                                                                        <select
                                                                            value={formData[field.field] || ""}
                                                                            onChange={(e) => props.handleleadstatusChange(e, field.field)}
                                                                            className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white cursor-pointer"
                                                                            onFocus={() => setIsOpen(true)}
                                                                            onBlur={() => setIsOpen(false)}
                                                                        >
                                                                            <option value="">Select Brand</option>
                                                                            {props.brandOptions.map((option, idx) => (
                                                                                <option key={idx} value={option.value}>
                                                                                    {option.label}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                                            {isOpen ? <FaAngleUp /> : <FaAngleDown />}
                                                                        </span>
                                                                    </div>
                                                                )
                                                                    : (
                                                                        <></>
                                                                    )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={50} className="text-center p-5">
                                                <img
                                                    src={"/No_Data_Found.svg"}
                                                    alt={"No Data Found"}
                                                    className="mx-auto h-[300px]"
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <nav
                    className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 pt-4"
                    aria-label="Table navigation"
                >
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-500">
                        Showing
                        <span className="font-semibold text-gray-900 dark:text-gray-600"> {sortedData.length} </span>
                        Entries
                    </span>
                </nav>
            </section>
        );
    }
    catch (e) {
        console.log(e);
        return <></>;
    }
};

export default Table;
