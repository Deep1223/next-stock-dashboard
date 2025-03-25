"use client";

import React, { useState, useEffect } from "react";
import KeyLeadMetrics from "../components/KeyLeadMetrics";
import LeadsBySource from "../components/LeadsBySource";
import OverallLeadFunnel from "../components/OverallLeadFunnel";
import TopNewLeads from "../components/TopNewLeads";
import TeamTaskSummary from "../components/TeamTaskSummary";
import { useRouter } from "next/navigation";

const availableComponents = [
  { id: "keyLeadMetrics", name: "Key Lead Metrics", component: KeyLeadMetrics, width: 1 },
  { id: "leadsBySource", name: "Leads by Source", component: LeadsBySource, width: 2 },
  { id: "overallLeadFunnel", name: "Overall Lead Funnel", component: OverallLeadFunnel, width: 2 },
  { id: "topNewLeads", name: "Top New Leads", component: TopNewLeads, width: 1 },
  { id: "teamTaskSummary", name: "Team Task Summary", component: TeamTaskSummary, width: 1 },
];

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedComponents, setAddedComponents] = useState(() => {
    let savedComponents = null;
    if (typeof window !== "undefined") {
      savedComponents = localStorage.getItem("dashboardComponents");
    }
    return savedComponents ? JSON.parse(savedComponents) : [];
  });
  const [fullscreenComponent, setFullscreenComponent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardComponents", JSON.stringify(addedComponents));
    }
  }, [addedComponents]);


  const handleAddComponent = (componentId) => {
    if (!addedComponents.includes(componentId)) {
      setAddedComponents([...addedComponents, componentId]);
    }
    setIsModalOpen(false);
  };

  const handleRemoveComponent = (componentId) => {
    setAddedComponents(addedComponents.filter((id) => id !== componentId));
    if (fullscreenComponent === componentId) setFullscreenComponent(null);
  };

  const toggleFullscreen = (componentId) => {
    setFullscreenComponent(fullscreenComponent === componentId ? null : componentId);
  };

  const renderComponent = (comp) => {
    const Component = comp.component;
    const isFullscreen = fullscreenComponent === comp.id;
    return (
      <div
        key={comp.id}
        className={`bg-white rounded-xl shadow-lg transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50 m-[50px] p-6" : "p-1"
          } ${comp.width === 2 ? "col-span-2" : "col-span-1"}`}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">{comp.name}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => toggleFullscreen(comp.id)}
              className="p-2 rounded-full transition-colors"
            >
              {isFullscreen ? (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
                  />
                </svg>
              )}
            </button>

            {!isFullscreen && (
              <button
                onClick={() => handleRemoveComponent(comp.id)}
                className="p-2 hover:bg-red-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-red-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

        </div>
        <div className={isFullscreen ? "h-[calc(100%-4rem)] overflow-auto" : ""}>
          <Component />
        </div>
      </div>
    );
  };

  const getRows = () => {
    const rows = [];
    let currentRow = [];
    let currentWidth = 0;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1000;
    addedComponents.forEach((compId) => {
      const comp = availableComponents.find((c) => c.id === compId);
      if (!comp) return;
      const compWidth = isMobile ? 1 : comp.width;
      if (isMobile || currentWidth + compWidth > 2) {
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [];
        currentWidth = 0;
      }
      currentRow.push(comp);
      currentWidth += compWidth;
    });
    if (currentRow.length > 0) rows.push(currentRow);
    return rows;
  };

  const rows = getRows();

  return (
    <div className="min-h-screen  md:p-8">
      <div className="mb-8">
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md">
          Add Dashlists
        </button>
      </div>
      <div className="space-y-6 overflow-x-auto md:overflow-visible">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid gap-6 md:grid-cols-2">
            {row.map((comp) => renderComponent(comp))}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add Dashlist Components</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-600">X</button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {availableComponents.filter((comp) => !addedComponents.includes(comp.id)).map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => handleAddComponent(comp.id)}
                  className="w-full text-left p-3 mb-2 bg-gray-50 hover:bg-indigo-50 rounded-lg border border-gray-200"
                >
                  {comp.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;