import React, { useState } from 'react';
import "../CSS/adminJob.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const CreateJob = () => {
      const [formData, setFormData] = useState({
        title: "",
        description: "",
        salary: "",
        jobType: "",
        location: "",
        companyName: "",
      });
      const navigate = useNavigate();
      const [logo, setLogo] = useState(null);

      const handleFileChange = (e) => {
        setLogo(e.target.files[0]);
      };

     const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
     const email = user?.email;


      const [message, setMessage] = useState("");
      const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };





      const handleCreateJob = async (e) => {
        e.preventDefault();
        setMessage("");
      
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("salary", formData.salary);
        formDataToSend.append("jobType", formData.jobType);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("companyName", formData.companyName);
        formDataToSend.append("email", email);
        if (logo) {
          formDataToSend.append("logo", logo);
        }
      
        try {
          const response = await axios.post("http://localhost:8000/api/v1/job/register-job", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log(response);
          
      
          setMessage("Job created successfully!");
          setFormData({
            title: "",
            description: "",
            salary: "",
            jobType: "",
            location: "",
            companyName: "",
          });
          setLogo(null);
        } catch (error) {
          console.error("Error creating job:", error.response?.data);
          setMessage("Failed to create job.");
        }

        navigate("/manage-jobs");
      };

      
      
      
      
    
          
  return (
    <div> <h3>Create a New Job</h3>
    {message && <p className="message">{message}</p>}
    <form className="job-form" onSubmit={handleCreateJob}>
      <input type="text" name="title" placeholder="Job Title" required value={formData.title} onChange={handleInputChange} />
      <textarea name="description" placeholder="Job Description" required value={formData.description} onChange={handleInputChange}></textarea>
      <input type="text" name="salary" placeholder="Salary" required value={formData.salary} onChange={handleInputChange} />
      <input type="text" name="jobType" placeholder="Job Type (Full-time, Part-time)" required value={formData.jobType} onChange={handleInputChange} />
      <input type="text" name="location" placeholder="Location" required value={formData.location} onChange={handleInputChange} />
      <input type="text" name="companyName" placeholder="Company Name" required value={formData.companyName} onChange={handleInputChange} />
      <input type="file" accept="image/*" onChange={handleFileChange} required />
      <button type="submit" className="create-btn">Create Job</button>
    </form>
    </div>
  )
}

export default CreateJob