"use client";

import { useState } from "react";

const TeamTaskSummary = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  const taskData = [
    { name: "YASH DESHMUKH", incomplete: 14439, pending: 0, today: 0, overdue: 14439, completed: 2 },
    { name: "Parth Gore", incomplete: 643, pending: 39, today: 18, overdue: 604, completed: 324 },
    { name: "Krishna Sharma", incomplete: 709, pending: 107, today: 31, overdue: 602, completed: 568 },
    { name: "Gaurav Patinge", incomplete: 513, pending: 59, today: 12, overdue: 454, completed: 374 },
    { name: "Debolina Upadhaya", incomplete: 260, pending: 15, today: 12, overdue: 245, completed: 663 },
  ];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2 mb-3">
       
        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          <button 
            className="px-2 py-1 bg-gray-200 text-gray-600 rounded disabled:opacity-50" 
            disabled={currentPage === 1} 
            onClick={() => handlePageChange(currentPage - 1)}
          >
            «
          </button>
          <span className="text-sm">
            Page <input className="w-10 text-center border rounded" type="text" value={currentPage} readOnly /> of {totalPages}
          </span>
          <button 
            className="px-2 py-1 bg-gray-200 text-gray-600 rounded disabled:opacity-50" 
            disabled={currentPage === totalPages} 
            onClick={() => handlePageChange(currentPage + 1)}
          >
            »
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="p-2 border">User Name</th>
              <th className="p-2 border">Total Incomplete Task</th>
              <th className="p-2 border">Pending</th>
              <th className="p-2 border">Pending for Today</th>
              <th className="p-2 border">Overdue</th>
              <th className="p-2 border">Recently Completed</th>
            </tr>
          </thead>
          <tbody>
            {taskData.map((user, index) => (
              <tr key={index} className="text-sm hover:bg-gray-50">
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.incomplete}</td>
                <td className="p-2 border">{user.pending}</td>
                <td className="p-2 border">{user.today}</td>
                <td className="p-2 border">{user.overdue}</td>
                <td className="p-2 border">{user.completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamTaskSummary;
