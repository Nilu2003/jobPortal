import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/adminJob.css"; // Ensure you have this CSS file

const AdminJob = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    jobType: "",
    location: "",
    companyName: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
  const email = user?.email;

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }
    
    const fetchJobs = async () => {
      try {
        const response = await axios.post("http://localhost:8000/api/v1/job/jobs/recruiter", { email });
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [email, navigate]);

  const handleEdit = (jobId) => {
    navigate(`http://localhost:8000/api/v1/job/getjob/${jobId}`);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8000/api/v1/job/register-job", {
        ...formData,
        email, // Send recruiter's email
      });

      setJobs([...jobs, response.data.job]); // Update job list
      setMessage("Job created successfully!");
      setFormData({ title: "", description: "", salary: "", jobType: "", location: "", companyName: "" });
    } catch (error) {
      console.error("Error creating job:", error.response?.data);
      setMessage("Failed to create job.");
    }
  };

  return (
    <div className="admin-job-container">
      <h2>My Posted Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs found. Start posting now!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.companyName}</td>
                <td>{job.location}</td>
                <td>{job.salary}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(job._id)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Job Creation Form */}
      <h3>Create a New Job</h3>
      {message && <p className="message">{message}</p>}
      <form className="job-form" onSubmit={handleCreateJob}>
        <input type="text" name="title" placeholder="Job Title" required value={formData.title} onChange={handleInputChange} />
        <textarea name="description" placeholder="Job Description" required value={formData.description} onChange={handleInputChange}></textarea>
        <input type="text" name="salary" placeholder="Salary" required value={formData.salary} onChange={handleInputChange} />
        <input type="text" name="jobType" placeholder="Job Type (Full-time, Part-time)" required value={formData.jobType} onChange={handleInputChange} />
        <input type="text" name="location" placeholder="Location" required value={formData.location} onChange={handleInputChange} />
        <input type="text" name="companyName" placeholder="Company Name" required value={formData.companyName} onChange={handleInputChange} />
        <button type="submit" className="create-btn">Create Job</button>
      </form>
    </div>
  );
};

export default AdminJob;
