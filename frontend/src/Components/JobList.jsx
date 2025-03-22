import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "./JobCard";
import "../CSS/jobcard.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/job/getjob"); // Replace with your API URL
        console.log(response);
        console.log(response.data);
        console.log(response.data.jobs);
        
        setJobs(response.data.jobs);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch jobs. Try again later.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="job-list">
      {jobs.length > 0 ? (
        jobs.map((job) => <JobCard key={job._id} job={job} />)
      ) : (
        <p>No jobs available</p>
      )}
    </div>
  );
};

export default JobList;
