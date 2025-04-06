import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/applied.css";

const Applied = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setError("No user found. Please log in.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user._id; // Get user ID from localStorage

      try {
        const response = await axios.get(
          `http://jobportal-r2s1.onrender.com/api/v1/application/get-application-user/${userId}`
        );

        setAppliedJobs(response.data || []);
      } catch (err) {
        setError("Failed to fetch applied jobs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <div className="applied-container">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {appliedJobs.length === 0 && !loading && !error && (
        <p>No jobs applied yet.</p>
      )}

      {appliedJobs.length > 0 && (
        <ul>
          {appliedJobs.map((job) => (
            <li key={job._id} className="applied-job">
              <h3>{job.jobId?.title}</h3>
              <p><strong>Company:</strong> {job.jobId?.companyName}</p>
              <p><strong>Location:</strong> {job.jobId?.location}</p>
              <p><strong>Status:</strong> {job.status}</p>
              <p><strong>Applied Date:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Applied;
