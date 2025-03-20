import React from "react";

const KeyLeadMetrics = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Header */}
     

      {/* Last 30 Days Section */}
      <div>
        <h3 className="text-md font-semibold mb-2">Last 30 Days</h3>
        <div className="grid grid-cols-3 gap-4">
          <MetricCard title="New Leads" value="14,833" />
          <MetricCard title="Engagement" value="0%" />
          <MetricCard title="Active Leads" value="95%" />
        </div>
      </div>

      {/* Overall Section */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Overall</h3>
        <div className="grid grid-cols-3 gap-4">
          <MetricCard title="Total Leads" value="15,669" />
          <MetricCard title="Engagement" value="0%" />
          <MetricCard title="Active Leads" value="93%" />
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value }) => {
  return (
    <div className="text-center border rounded-lg p-3 bg-gray-100">
      <h4 className="text-xs font-medium text-gray-600">{title}</h4>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
};

export default KeyLeadMetrics;
