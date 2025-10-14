"use client";
import { useState, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import Modal from "@/components/modal";
import IISMethods from '@/utils/IISMethods';
import Config from '@/config/config';

const DeleteModal = (props) => {
    const [stage, setStage] = useState(1);
    const [confirmText, setConfirmText] = useState("");
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const confirmPhrase = "DELETE";

    useEffect(() => {
        if (stage === 2) {
            setIsButtonEnabled(confirmText.toUpperCase() === confirmPhrase);
        }
    }, [confirmText, stage]);

    const handleDeleteClose = () => {
        props.setModalDeleteOpen(false);
        setStage(1);
        setConfirmText("");
        setIsButtonEnabled(false);
        
        // Show info toast when deletion is cancelled
        if (stage === 2) {
            IISMethods.errormsg(Config.cancelling, 4);
        }
    };

    const handleNextStage = () => {
        setStage(2);
    };

    const handleDelete = async () => {
        if (!isButtonEnabled) return;

        setIsDeleting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success toast
            IISMethods.errormsg(Config.datadeleted, 2);
            
            setShowSuccess(true);
            handleDeleteClose();
            setShowSuccess(false);
        } catch (error) {
            // Show error toast
            IISMethods.errormsg(Config.datadeleted, 1);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleInputChange = (e) => {
        setConfirmText(e.target.value.toUpperCase());
    };

    try {
        return (
            <>
                <Modal
                    open={props.modalDeleteOpen}
                    onClose={handleDeleteClose}
                    width="w-120"
                    header={
                        <div className="flex items-center">
                            <FiAlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                {stage === 1 ? "Confirm Deletion" : "Final Confirmation Required"}
                            </h3>
                        </div>
                    }
                    body={
                        <>
                            {stage === 1 ? (
                                <p className="text-gray-600">Are you sure you want to delete this item? This action cannot be undone.</p>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-gray-600">
                                        To confirm, type <strong>{confirmPhrase}</strong> below:
                                    </p>
                                    <input
                                        type="text"
                                        value={confirmText}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                                        style={{ textTransform: 'uppercase' }}
                                        placeholder="Type confirmation phrase"
                                        autoFocus
                                    />
                                </div>
                            )}
                        </>
                    }
                    footer={
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleDeleteClose}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                {Config.cancelbtn}
                            </button>
                            {stage === 1 ? (
                                <button
                                    onClick={handleNextStage}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                    {Config.continuebtn}
                                </button>
                            ) : (
                                <button
                                    onClick={handleDelete}
                                    disabled={!isButtonEnabled || isDeleting}
                                    className={`px-4 py-2 rounded-lg ${isButtonEnabled ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                >
                                    {isDeleting ? "Deleting..." : Config.deletebtn}
                                </button>
                            )}
                        </div>
                    }
                />
            </>
        );
    }
    catch (e) {
        console.log(e);
        return <></>;
    }
};

export default DeleteModal;
