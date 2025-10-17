import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from 'react-router-dom';
import { createFeedback } from "../../hooks/useFeedback";

export default function FeedbackForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    // name: "",
    // email: "",
    rating: 0,
    message: "",
    service: id,
  });

  const messages = ["Terrible", "Bad", "Ok", "Good", "Amazing"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRating = (newRating) => {
    setFormData((prev) => ({
      ...prev,
      rating: newRating,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    // console.log(formData);
    if ( !formData.rating) {
      toast.error("Please fill rating.");
      return;
    }
    await createFeedback(formData);
  };

  const containerStyle = {
    maxWidth: "600px",
    margin: "50px auto",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f0f4ff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const headingStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  };

  const textStyle = {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
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

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#5a5af2",
    backgroundColor: "transparent",
    border: "2px solid #5a5af2",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "all 0.3s",
  };
  // console.log(formData,"formdata");
  

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Your feedback matters.</h1>
      <p style={textStyle}>
        Please provide your feedback so that we can continue to improve.
      </p>

      <form style={formStyle} onSubmit={handleSubmit}>
        {/* <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            style={inputStyle}
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            style={inputStyle}
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div> */}

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
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Submit
        </button>
      </form>
    </div>
  );
}
