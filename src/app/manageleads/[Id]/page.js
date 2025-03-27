"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Phone, Mail, MapPin, ArrowLeft, Calendar, User, PersonStanding, Soup as Source, Clock, CircleDot, MessageCircle, PhoneMissed, CalendarClock, Users,
  Send, CheckCircle, XCircle, Ban, UserX, ChevronDown, X
} from "lucide-react";
import { FaEdit } from "react-icons/fa";
import Modal from "@/components/modal";
import Config from "@/config/config";

const LeadDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const leadId = params.Id;
  const [leadData, setLeadData] = useState(null);
  const [leadStatusData, setLeadStatusData] = useState(null);
  const [activeTab, setActiveTab] = useState("status");
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [newStage, setNewStage] = useState("");

  const leadStages = {
    "Untouched Lead": <MessageCircle className="w-5 h-5 text-blue-600" />,
    "Not Connected Lead": <PhoneMissed className="w-5 h-5 text-red-600" />,
    "Follow Up Lead": <CalendarClock className="w-5 h-5 text-yellow-600" />,
    "Counselling Scheduled": <Users className="w-5 h-5 text-green-600" />,
    "Payment Link Sent": <Send className="w-5 h-5 text-purple-600" />,
    "Enrolled": <CheckCircle className="w-5 h-5 text-green-600" />,
    "Invalid": <XCircle className="w-5 h-5 text-gray-600" />,
    "Not Interested": <Ban className="w-5 h-5 text-red-600" />,
    "Not Interested after Counselling": <UserX className="w-5 h-5 text-red-600" />,
  };

  const fetchLeadData = async (leadId, setLeadData) => {
    if (!leadId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch(
        `https://dev.crmbackend.finnovationz.com/api/leads/getLead/${leadId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();
      if (result.data && result.data.length > 0) {
        setLeadData(result.data[0]);
      }
    } catch (error) {
      console.error("Error fetching lead data:", error);
    }
  };

  const fetchLeadStatusData = async (leadId) => {
    if (!leadId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const leadStatusData = await fetch(
        `https://dev.crmbackend.finnovationz.com/api/leads/getLeadActivity/${leadId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await leadStatusData.json();
      if (result.activities && result.activities.length > 0) {
        setLeadStatusData(result.activities);
      }
    } catch (error) {
      console.error("Error fetching lead data:", error);
    }
  };

  useEffect(() => {
    fetchLeadData(leadId, setLeadData);
  }, [leadId]);

  useEffect(() => {
    fetchLeadStatusData(leadId);
  }, [leadId, leadData]);

  const handleStageChange = async () => {
    const token = localStorage.getItem("token");
    if (!token || !newStage) return;

    try {
      const response = await fetch("https://dev.crmbackend.finnovationz.com/api/leads/updateLeadStatus", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          leadId: leadId,
          status: newStage
        })
      });

      if (response.ok) {
        // Refresh lead data
        const updatedLead = await response.json();
        setLeadData(prevData => ({
          ...prevData,
          leadStatus: newStage
        }));
        setShowStageModal(false);
        fetchLeadData()
      } else {
        console.error("Failed to update lead status");
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      const statusColors = {
        "In Progress": "bg-blue-100 text-blue-800",
        "Completed": "bg-green-100 text-green-800",
        "Pending": "bg-yellow-100 text-yellow-800",
        default: "bg-gray-100 text-gray-800"
      };
      return statusColors[status] || statusColors.default;
    };

    return (
      <span className={`px-3 py-2 rounded-xl text-sm font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="lead-detail-height mb-3 mt-2">
      {/* Header */}
      {/* <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Manage Leads</span>
            </button>
          </div>
        </div>
      </div> */}

      <div className="px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Lead Profile */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
              {leadData ? (
                <div className="lead-detail-profile">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
                    <h2 className="text-2xl font-bold text-white mb-5">{leadData.name}</h2>
                    <div className="flex gap-3 items-center">
                      <StatusBadge status={leadData.leadStatus} />
                      <FaEdit size={24} className="text-white cursor-pointer" onClick={() => setShowStageModal(true)} />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-5 h-5 mr-3" />
                        <span>{leadData.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-5 h-5 mr-3" />
                        <span>{leadData.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3" />
                        <span>{leadData.address || "No address provided"}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Lead Source</h3>
                        <p className="text-blue-900">{leadData.leadSource}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Details & Activity */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
              <div className="border-b">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("status")}
                    className={`px-6 py-4 text-sm cursor-pointer font-medium border-b-2 ${activeTab === "status"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    Lead Status
                  </button>
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`px-6 py-4 text-sm cursor-pointer font-medium border-b-2 ${activeTab === "details"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    Lead Details
                  </button>
                </nav>
              </div>

              <div className="p-6 lead-status-history">
                {activeTab === "status" && leadData && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-6">Activity History</h3>
                      <div className="space-y-6">
                        {/* Activity Item */}
                        {
                          leadStatusData?.length > 0 ?
                            leadStatusData?.map((data, index) => (
                              <div key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    {leadStages[data.newStatus] || <CircleDot className="w-5 h-5 text-blue-600" />}
                                  </div>
                                </div>
                                <div className="flex-grow">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-gray-900">
                                        {formatDate(data.updatedAt)}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {formatTime(data.updatedAt)}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-600">
                                    Lead status <span className="font-medium">{data.newStatus}</span>
                                  </p>
                                </div>
                              </div>
                            ))
                            :
                            <div className="text-center p-5">
                              <img
                                src={"/No_Data_Found.svg"}
                                alt={"No Data Found"}
                                className="mx-auto h-[300px]"
                              />
                            </div>
                        }

                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "details" && leadData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-gray-400 mt-1" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">Owner</h4>
                          <p className="mt-1 text-sm text-gray-600">{leadData.ownerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <PersonStanding className="w-5 h-5 text-gray-400 mt-1" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">Lead Source</h4>
                          <p className="mt-1 text-sm text-gray-600">{leadData.leadSource}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">Created Date</h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {new Date(leadData.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-gray-400 mt-1" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">Last Activity</h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {new Date(leadData.updatedAt || leadData.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      <Modal
        open={showStageModal}
        onClose={() => setShowStageModal(false)}
        width="w-120"
        header="Change Status"
        body={
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Old Value</label>
                <div className="mt-1 p-2 bg-gray-50 border border-black rounded-md">
                  {leadData?.leadStatus}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">New Value</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="mt-1 block w-full border border-black pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select stage</option>
                  {Object.keys(leadStages).map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        }
        footer={
          <>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleStageChange}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Change
              </button>

              <button
                onClick={() => setShowStageModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 cursor-pointer rounded hover:bg-gray-300"
              >
                {Config.closebtn}
              </button>
            </div>
          </>
        }
      />
    </div>
  );
};

export default LeadDetailsPage;