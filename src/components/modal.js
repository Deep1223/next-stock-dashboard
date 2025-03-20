"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IoIosCloseCircleOutline } from "react-icons/io";

const Modal = (props) => {
    // ---------------------------- modal Width Start ---------------------------- //

    // Extra Small	    w-48	    192px
    // Small	        w-64	    256px	
    // Medium (Default)	w-96	    384px
    // normal Modal     w-120       480px
    // Large	        w-160	    640px	
    // Extra Large	    w-[50rem]	800px	
    // Full Width	    w-full	    100%	

    // ---------------------------- modal Width Start ---------------------------- //

    try {
        return (
            <AnimatePresence>
                {props.open && (
                    <>
                        {/* Background Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* Modal Container */}
                        <div className="fixed inset-0 flex justify-center items-start z-50">
                            <motion.div
                                className={`bg-white p-[20px] rounded-lg shadow-lg relative z-50 ${props.width ? props.width : 'w-120'} modal-content`}
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 30, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center pb-2">
                                    {
                                        props.header ?
                                            props.header
                                            :
                                            <></>
                                    }
                                    <button onClick={props.onClose} className="text-red-500 hover:text-red-700 text-3xl cursor-pointer">
                                        <IoIosCloseCircleOutline />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="pb-2">
                                    {
                                        props.body ?
                                            props.body
                                            :
                                            <></>
                                    }
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end space-x-3 mt-3">
                                    {
                                        props.footer ?
                                            props.footer
                                            :
                                            <></>
                                    }
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        );
    }
    catch (e) {
        console.log(e);
        return <></>;
    }
};

export default Modal;
