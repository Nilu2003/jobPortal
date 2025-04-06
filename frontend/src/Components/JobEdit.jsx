import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../CSS/adminJob.css";

const JobEdit = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!jobId) {
          throw new Error("Invalid Job ID");
        }

        const response = await fetch(`http://localhost:8000/api/v1/job/getjob/${jobId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job");
        }

        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]); // ✅ Correct dependency array

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!job) return <p>Job not found</p>;

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
};

  const handleSave = async () => {
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;
  
      if (!email) {
        throw new Error("Unauthorized: Please log in.");
      }
  
      const response = await fetch(`http://localhost:8000/api/v1/job/updateJob/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...job, email }),
      });
  
      const text = await response.text(); // Read raw response
      let data;
      
      try {
        data = JSON.parse(text); // Try parsing JSON
      } catch {
        throw new Error("Invalid response from server");
      }
  
      if (!response.ok) throw new Error(data.message || "Failed to update job");
  
      alert("Job updated successfully!");
      navigate("/manage-jobs");
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  

  return (
    <div className="admin-job-container" onSubmit={handleSave}>
      <h2>Edit Job</h2>
      <form className="job-form">
        <label>Title:</label>
        <input type="text"  name="title" value={job.title} onChange={handleChange} required />

        <label>Description:</label>
        <textarea value={job.description}  name="description"onChange={handleChange} required></textarea>

        <label>Salary:</label>
        <input type="text" value={job.salary} name="salary" onChange={handleChange} required />

        <label>Job Type:</label>
        <input type="text" value={job.jobType} name="jobType" onChange={handleChange} required/>

        <label>Location:</label>
        <input type="text" value={job.location} name="location" onChange={handleChange} required />

        <label>Company Name:</label>
        <input type="text" value={job.companyName} name="companyName" onChange={handleChange} required />
        <button type="submit">Update Job</button>
      </form>
    </div>
  );
};

export default JobEdit;
