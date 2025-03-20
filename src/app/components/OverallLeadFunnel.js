import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer } from "recharts";

const data = [
  { name: "Untouched Lead", value: 12762 },
  { name: "Not Connected Lead", value: 796 },
  { name: "Follow Up Lead", value: 555 },
  { name: "Counselling Scheduled", value: 322 },
  { name: "Payment Link Sent", value: 16 },
  { name: "Launchpad", value: 109 },
];

const OverallLeadFunnel = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={data} margin={{ left: 20, right: 20 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#ff7979" barSize={20}>
            {/* Display value on each bar */}
            <LabelList dataKey="value" position="right" fill="#333" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverallLeadFunnel;
