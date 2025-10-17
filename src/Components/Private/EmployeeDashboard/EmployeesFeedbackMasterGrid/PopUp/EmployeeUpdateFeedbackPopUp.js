import { useState } from "react";
import toast from "react-hot-toast";
import { createFeedback } from "../../../../../hooks/useFeedback";

const EmployeeUpdateFeedbackPopUp = ({ handleUpdate, selectedFeedback }) => {
    const [formData, setFormData] = useState({
        rating: 0,
        message: "",
        service: selectedFeedback._id,
        submitBy: "Employee"
    });
    
    const messages = ["Good", "Very Good", "Excellent", "Outstanding", "Amazing"];
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFeedbackUpdate = async (event) => {
        event.preventDefault();
        
        // Validate form
        if (formData.rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        
        if (!formData.message.trim()) {
            toast.error("Please enter a message");
            return;
        }
        
        try {
            console.log("Submitting feedback:", formData);
            toast.loading("Creating Feedback...");
            
            const result = await createFeedback(formData);
            
            if (result && result.success) {
                toast.dismiss();
                toast.success(result.message || "Feedback submitted successfully!");
                handleUpdate();
            } else {
                toast.dismiss();
                toast.error(result?.error || "Failed to submit feedback");
            }
        } catch (error) {
            toast.dismiss();
            console.error("Error submitting feedback:", error);
            toast.error(error.response?.data?.error || "Failed to submit feedback");
        }
    };

    const handleRating = (newRating) => {
        setFormData((prev) => ({
            ...prev,
            rating: newRating,
        }));
    };

    const formGroupStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    };

    const labelStyle = {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "5px",
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        border: "1px solid #ccc",
        borderRadius: "4px",
    };

    const textAreaStyle = {
        ...inputStyle,
        height: "80px",
        resize: "none",
    };

    const starsContainerStyle = {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
    };

    const starStyle = (full) => ({
        fontSize: "30px",
        cursor: "pointer",
        color: full ? "#fcc419" : "#ccc",
        transition: "color 0.3s",
    });

    const ratingMessageStyle = {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#fcc419",
        marginTop: "10px",
    };

    return (
        <>
            <div
                className="modal fade show"
                style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#00000090",
                }}
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content p-3">
                        <form onSubmit={handleFeedbackUpdate}>
                            <div className="modal-header pt-0">
                                <h5 className="card-title fw-bold" id="exampleModalLongTitle">
                                    Feedback
                                </h5>
                                <button
                                    onClick={() => handleUpdate()}
                                    type="button"
                                    className="close px-3"
                                    style={{ marginLeft: "auto" }}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row modal_body_height">
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Rating</label>
                                        <div style={starsContainerStyle}>
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <span
                                                    key={i}
                                                    style={starStyle(formData.rating >= i + 1)}
                                                    onClick={() => handleRating(i + 1)}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <p style={ratingMessageStyle}>
                                            {messages[formData.rating - 1] || "Select a rating"}
                                        </p>
                                    </div>

                                    <div style={formGroupStyle}>
                                        <label style={labelStyle} htmlFor="message">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            style={textAreaStyle}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Please share your feedback..."
                                            required
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-12 pt-3 mt-2">
                                            <button
                                                type="submit"
                                                className="w-80 btn addbtn rounded-0 add_button m-2 px-4"
                                            >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleUpdate}
                                                className="w-80 btn addbtn rounded-0 Cancel_button m-2 px-4"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployeeUpdateFeedbackPopUp;