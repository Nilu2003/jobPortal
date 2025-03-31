import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("User not found. Please log in.");
      return;
    }
  
    const loggedInUser = JSON.parse(storedUser);
    const userId = loggedInUser._id; // Ensure userId is present
    const jobId = job?._id; // Get jobId from job details
  
    if (!jobId) {
      alert("Job details are missing.");
      return;
    }
  
    const formData = new FormData();
    formData.append("fullname", user.fullname);
    formData.append("email", user.email);
    formData.append("phoneNumber", user.phoneNumber);
    formData.append("yearsOfExperience", yearsOfExperience || "0");
    formData.append("resume", resume);
    formData.append("jobId", jobId);  // Attach jobId
    formData.append("userId", userId);  // Attach userId
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/application/apply-job",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // console.log(response);
  
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Application submission failed!");
    }
  };
  

  return (
    <div className="apply-container">
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
            type="Number"
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
        <NavLink to="/">
        <button className="apply-btn" type="submit">Submit Application</button>
        </NavLink>
      </form>
    </div>
  );
};

export default ApplyNow;
