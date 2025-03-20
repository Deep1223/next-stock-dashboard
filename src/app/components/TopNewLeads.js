import React, { useState } from "react";

const TopNewLeads = () => {
  const [page, setPage] = useState(1);
  const totalPages = 1725;

  const leadsData = [
    { name: "Vinod", source: "Messaging", score: 0 },
    { name: "Mukesh Gupta", source: "Organic Search", score: 0 },
    { name: "Bhavya Goyal", source: "The Foundation Course on Indian Stock Market For b", score: 0 },
    { name: "Ankit Sharma", source: "Fundamental Analysis 2.0 2023", score: 0 },
  ];

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Lead Source</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Lead Score</th>
            </tr>
          </thead>
          <tbody>
            {leadsData.map((lead, index) => (
              <tr key={index} className="border border-gray-200">
                <td className="px-4 py-2 text-blue-500 underline cursor-pointer">{lead.name}</td>
                <td className="px-4 py-2">{lead.source}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-red-300 rounded-full">
                      <div
                        className="h-2 bg-red-500 rounded-full"
                        style={{ width: `${lead.score}%` }}
                      ></div>
                    </div>
                    <span className="ml-2">{lead.score}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          &lt;
        </button>
        <span>
          Page <strong>{page}</strong> of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default TopNewLeads;
