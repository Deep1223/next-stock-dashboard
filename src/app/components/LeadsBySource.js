import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const LeadsBySource = () => {
  const leadsData = [
    { source: "The complete course on Indian stock market", count: 5201 },
    { source: "Fundamental analysis 2.0 2023", count: 3356 },
    { source: "The complete course on Fundamental Analysis", count: 2492 },
    { source: "The Foundation Course on Indian Stock Market", count: 1507 },
    { source: "Diwali Combo Leads NOV 2024", count: 762 },
    { source: "The Complete Course On Options Trading", count: 683 },
    { source: "The Complete Fundamental Analysis Course in Hindi", count: 335 },
    { source: "17k leads (Ritesh)", count: 115 },
    { source: "Student MBA (RITESH)", count: 98 },
    { source: "[Other Values]", count: 29 },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="h-80 overflow-y-auto">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart layout="vertical" data={leadsData} margin={{ left: 20, right: 20 }}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="source" width={200} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#ff7f7f" barSize={20}>
              {/* Display count value on each bar */}
              <LabelList dataKey="count" position="right" fill="#333" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeadsBySource;
