import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "../CSS/adminJob.css"; 

const AdminJob = () => {
  const [jobs, setJobs] = useState([]);
 

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
        const response = await axios.post("http://jobportal-r2s1.onrender.com/api/v1/job/jobs/recruiter", { email });
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [email, navigate]);

  const handleEdit = (jobId) => {
    navigate(`/job-edit/${jobId}`);
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
     <NavLink to="/create-job">
        <button>Create Job</button>
     </NavLink>
    </div>
  );
};

export default AdminJob;
