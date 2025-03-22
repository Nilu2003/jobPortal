import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../CSS/applyNow.css"; // Import CSS for styling

const ApplyNow = () => {
  const location = useLocation();
  const job = location.state?.job; // Get job details

  const [user, setUser] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
  });

  const [yearsOfExperience, setYearsOfExperience] = useState(""); // New state for experience
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const loggedInUser = JSON.parse(storedUser);
      setUser({
        fullname: loggedInUser.fullname || "",
        email: loggedInUser.email || "",
        phoneNumber: loggedInUser.phoneNumber || "",
      });
    } else {
      console.warn("No user found in localStorage. Please log in.");
    }
  }, []);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert("Please upload a resume!");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", user.fullname);
    formData.append("email", user.email);
    formData.append("phoneNumber", user.phoneNumber);
    formData.append("yearsOfExperience", yearsOfExperience || "0"); // Default to 0 if not provided
    formData.append("resume", resume);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/application/apply-job",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response);

      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Application submission failed!");
    }
  };

  return (
    <div className="apply-container">
      <h1>apply job</h1>
      <h2 className="apply-title">Apply for <span>{job?.title}</span></h2>
      <form className="apply-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullname"
            value={user.fullname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Years of Experience:</label>
          <input
            type="number"
            min="0"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            placeholder="Enter years of experience (0 for freshers)"
            required
          />
        </div>
        <div className="form-group">
          <label>Upload Resume:</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
        </div>
        <button className="apply-btn" type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default ApplyNow;
