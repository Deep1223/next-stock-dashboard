import Modal from "./modal";

const ViewModal = (props) => {
    try {
        return (
            <Modal
                open={props.modalViewOpen}
                onClose={() => props.setModalViewOpen(false)}
                header={<h2 className="text-lg font-semibold">{props.title}</h2>}
                body={
                    <div className="grid grid-cols-2 gap-4">
                        {props.fieldOrder.map((field) => (
                            <div key={field.field} className={`w-full ${field.size || ''}`}>
                                <label className="block text-gray-600 font-medium">{field.label}</label>
                                <span className="text-gray-500">{props.viewDetails?.[field.field] ?? "N/A"}</span>
                            </div>
                        ))}
                    </div>
                }
                footer={
                    <button
                        onClick={() => props.setModalViewOpen(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                }
            />
        );
    } catch (e) {
        console.log(e);
        return <></>;
    }
};

export default ViewModal;
