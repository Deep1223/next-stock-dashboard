import Modal from "./modal";
import Config from "@/config/config";
import RightSidebarFormField from '@/components/RightSidebarFormField';
import validateField from '@/components/Validation';
import { toast } from 'react-toastify';

const CreateModal = (props) => {
    try {
        const hasTabs = props.rightSidebarData.some(tab => tab.tabname); // Check if any tabname exists

        const handleNextButtonClick = async (tabfield, activeIndex) => {
            let newErrors = {};
            let emptyFields = false;
        
            tabfield.forEach((field) => {
                const fieldValue = props.formData[field.field] || '';
        
                // Checkbox field validation
                if (field.type === "checkbox" && field.required) {
                    if (!props.formData[field.field] || props.formData[field.field].length === 0) {
                        emptyFields = true;
                        newErrors[field.field] = Config.thisfieldrequirederror;
                    }
                }
                // Other field validations
                else {
                    const errorMessage = validateField(field.text, fieldValue, { required: field.required, type: field.regextype });
        
                    if (field.required && !fieldValue) {
                        emptyFields = true;
                        newErrors[field.field] = Config.thisfieldrequirederror;
                    } else if (errorMessage) {
                        newErrors[field.field] = errorMessage;
                    }
                }
            });
        
            // Show error toast if fields are empty
            if (emptyFields) {
                props.setErrors(newErrors);
                toast.error(Config.fillallfieldserror);
                return;
            }
        
            // Show first validation error (if any)
            if (Object.keys(newErrors).length > 0) {
                props.setErrors(newErrors);
                toast.error(Object.values(newErrors)[0]);
                return;
            }
        
            // Clear errors before moving to next tab
            props.setErrors({});
        
            // Move to next tab
            if (activeIndex + 1 < props.rightSidebarData.length) {
                props.setActiveTab(props.rightSidebarData[activeIndex + 1].tabname);
            }
        };

        return (
            <Modal
                width={'w-160'}
                open={props.modalOpen}
                onClose={() => props.setModalOpen(false)}
                header={<h2 className="text-lg font-semibold">{props.title}</h2>}
                body={
                    <form>
                        {/* Show Tabs Only if Any Tab Exists */}
                        {hasTabs && (
                            <div className="w-full border-b border-border">
                                <div className="flex space-x-5">
                                    {props.rightSidebarData.map((tab, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                props.setActiveTab(tab.tabname);
                                            }}
                                            className={`relative py-2 text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                                                ${props.activeTab === tab.tabname ? "!text-blue-700" : "text-gray-500 hover:text-gray-800"}`}
                                        >
                                            {tab.tabname}
                                            <span
                                                className={`absolute bottom-0 left-0 h-[2px] bg-blue-700 transition-all duration-300 
                                                    ${props.activeTab === tab.tabname ? "w-full scale-x-100" : "w-0 scale-x-0"}`}
                                            ></span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Display Fields (Filter by Active Tab if Tabs Exist) */}
                        <div className="pt-2">
                            {(hasTabs
                                ? props.rightSidebarData
                                    .filter((tab) => tab.tabname === props.activeTab)
                                    .flatMap((tab) => tab.fields)
                                : props.rightSidebarData.flatMap((tab) => tab.fields)
                            ).map((field, index) => (
                                <RightSidebarFormField
                                    key={index}
                                    field={field}
                                    errors={props.errors}
                                    handleChange={props.handleChange}
                                    formData={props.formData}
                                    setErrors={props.setErrors}
                                />
                            ))}
                        </div>

                    </form>
                }
                footer={
                    <>
                        {hasTabs ? (() => {
                            const activeIndex = props.rightSidebarData.findIndex((tab) => tab.tabname === props.activeTab);
                            const isFirstTab = activeIndex === 0;
                            const isLastTab = activeIndex === props.rightSidebarData.length - 1;

                            return (
                                <>
                                    {!isFirstTab && (
                                        <button
                                            onClick={() => props.setActiveTab(props.rightSidebarData[activeIndex - 1].tabname)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                        >
                                            {Config.previousbtn}
                                        </button>
                                    )}

                                    {!isLastTab && (
                                        <button
                                            onClick={() => handleNextButtonClick(props.rightSidebarData[activeIndex].fields, activeIndex)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                        >
                                            {Config.nextbtn}
                                        </button>
                                    )}

                                    {isLastTab && (
                                        <button
                                            onClick={props.handleAddButtonClick}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            {Config.createbtn}
                                        </button>
                                    )}
                                </>
                            );
                        })() : (
                            <button
                                onClick={props.handleAddButtonClick}
                                className="px-4 py-2 bg-blue-500 text-white cursor-pointer rounded hover:bg-blue-600"
                            >
                                {Config.createbtn}
                            </button>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => props.setModalOpen(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 cursor-pointer rounded hover:bg-gray-300"
                        >
                            {Config.closebtn}
                        </button>
                    </>
                }
            />
        );
    } catch (e) {
        console.log(e);
        return <></>;
    }
};

export default CreateModal;
