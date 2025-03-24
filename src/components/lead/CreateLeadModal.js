import { useState } from "react";
import Modal from "@/components/modal";
import Config from "@/config/config";
import validateField from "@/components/Validation";
import { toast } from "react-toastify";

const CreateModal = ({ modalOpen, setModalOpen, title, handleAddButtonClick }) => {
    const tabs = ["Import Csv File", "Map Fields", "Actions", "Summary"];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [formValues, setFormValues] = useState({});
    const [formErrors, setFormErrors] = useState({});

    console.log('formValues', formValues)

    const handleValidation = () => {
        let errors = {};
        let isValid = true;
    
        const requiredFieldsByTab = {
            "Import Csv File": ["lead"],
            "Map Fields": ["name"],
            "Actions": ["number", "fname", "email"],
            "Summary": ["text"],
        };
    
        const currentTabFields = requiredFieldsByTab[activeTab];
    
        currentTabFields.forEach((field) => {
            let error = validateField(field, formValues[field], { required: true });
            if (error) {
                errors[field] = error;
                isValid = false;
            }
        });
    
        if (!isValid) {
            setFormErrors(errors);
            toast.error(Config.fillallfieldserror, {
                className: "border border-red-500 text-red-500",
            });
        } else {
            setFormErrors({});
        }
    
        return isValid;
    };
    
    

    const handleNextButtonClick = () => {
        if (!handleValidation()) return;
    
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        }
    };
    


    const handlePreviousButtonClick = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };

    const handleInputChange = (e, field) => {
        const { value, files } = e.target;
        let newValue = files ? files[0] : value;

        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: newValue,
        }));

        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [field]: newValue ? null : prevErrors[field],
        }));
    };

    const handleCreateButtonClick = () => {
        if (handleFinalValidation()) {
            handleAddButtonClick(); // Proceed only if all fields are valid
        }
    };
    
    const handleFinalValidation = () => {
        let errors = {};
        let isValid = true;
    
        const requiredFieldsByTab = {
            "Import Csv File": { lead: { required: true, type: "file" } },
            "Map Fields": { name: { required: true, type: "text" } },
            "Actions": {
                number: { required: true, type: "number" },
                fname: { required: true, type: "text" },
                email: { required: true, type: "email" }
            },
            "Summary": { text: { required: true, type: "text" } }
        };
    
        Object.keys(requiredFieldsByTab).forEach((tab) => {
            Object.keys(requiredFieldsByTab[tab]).forEach((field) => {
                let error = validateField(field, formValues[field], requiredFieldsByTab[tab][field]);
                if (error) {
                    errors[field] = error;
                    isValid = false;
                }
            });
        });
    
        setFormErrors(errors); // Set errors once
    
        if (!isValid) {
            toast.error(Config.fillallfieldserror, {
                className: "border border-red-500 text-red-500",
            });
        }
    
        return isValid;
    };
    
    
    

    return (
        <Modal
            width={"w-160"}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            header={<h2 className="text-lg font-semibold">{title}</h2>}
            body={
                <form>
                    {/* Tabs */}
                    <div className="w-full border-b border-border">
                        <div className="flex space-x-5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab(tab);
                                    }}
                                    className={`relative py-2 text-sm font-medium cursor-pointer transition-colors ${activeTab === tab ? "!text-blue-700" : "text-gray-500 hover:text-gray-800"
                                        }`}
                                >
                                    {tab}
                                    <span
                                        className={`absolute bottom-0 left-0 h-[2px] bg-blue-700 transition-all duration-300 ${activeTab === tab ? "w-full scale-x-100" : "w-0 scale-x-0"
                                            }`}
                                    ></span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="pt-2">
                        {activeTab === "Import Csv File" && (
                            <>
                                <label
                                    className={`block text-sm font-medium text-gray-700 mb-1 ${formErrors.lead ? "text-red-500" : ""
                                        }`}
                                >
                                    Lead<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="file"
                                    className={`border p-2 rounded-md w-full text-sm ${formErrors.lead ? "border-red-500" : ""
                                        }`}
                                    onChange={(e) => handleInputChange(e, "lead")}
                                    accept=".csv,.xlsx"
                                />
                            </>
                        )}

                        {activeTab === "Map Fields" && (
                            <>
                                <label
                                    className={`block text-sm font-medium text-gray-700 mb-1 ${formErrors.name ? "text-red-500" : ""
                                        }`}
                                >
                                    Name<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`border p-2 rounded-md w-full text-sm ${formErrors.name ? "border-red-500" : ""
                                        }`}
                                    onChange={(e) => handleInputChange(e, "name")}
                                    defaultValue={formValues.name || ""}
                                />
                            </>
                        )}

                        {activeTab === "Actions" && (
                            <>
                                <label
                                    className={`block text-sm font-medium text-gray-700 mb-1 ${formErrors.number ? "text-red-500" : ""
                                        }`}
                                >
                                    Number<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`border p-2 rounded-md w-full text-sm ${formErrors.number ? "border-red-500" : ""
                                        }`}
                                    onChange={(e) => handleInputChange(e, "number")}
                                    defaultValue={formValues.number || ""}
                                />

                                <label
                                    className={`block text-sm font-medium text-gray-700 mb-1 ${formErrors.fname ? "text-red-500" : ""
                                        }`}
                                >
                                    First Name<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`border p-2 rounded-md w-full text-sm ${formErrors.fname ? "border-red-500" : ""
                                        }`}
                                    onChange={(e) => handleInputChange(e, "fname")}
                                    defaultValue={formValues.fname || ""}
                                />

                                <label className={`block text-sm font-medium text-gray-700 mb-1 ${formErrors.email ? "text-red-500" : ""}`}>
                                    Email<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    className={`border p-2 rounded-md w-full text-sm ${formErrors.email ? "border-red-500" : ""}`}
                                    onChange={(e) => handleInputChange(e, "email")}
                                    defaultValue={formValues.email || ""}
                                />

                            </>
                        )}

                        {activeTab === "Summary" && (
                            <>
                                <label
                                    className={`block text-sm font-medium text-gray-700 mb-1 ${formErrors.text ? "text-red-500" : ""
                                        }`}
                                >
                                    Text<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`border p-2 rounded-md w-full text-sm ${formErrors.text ? "border-red-500" : ""
                                        }`}
                                    onChange={(e) => handleInputChange(e, "text")}
                                    defaultValue={formValues.text || ""}
                                />
                            </>
                        )}
                    </div>
                </form>
            }
            footer={
                <>
                    {
                        activeTab !== 'Import Csv File' &&
                        <button onClick={handlePreviousButtonClick} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                            {Config.previousbtn}
                        </button>
                    }
                    {
                        activeTab !== 'Summary' &&
                        <button onClick={handleNextButtonClick} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                            {Config.nextbtn}
                        </button>
                    }
                    {
                        activeTab === 'Summary' &&
                        <button
                            onClick={handleCreateButtonClick}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {Config.createbtn}
                        </button>
                    }
                    {/* Close Button */}
                    <button
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        {Config.closebtn}
                    </button>
                </>
            }
        />
    );
};

export default CreateModal;
