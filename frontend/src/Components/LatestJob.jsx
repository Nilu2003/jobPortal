import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "./JobCard";
import "../CSS/jobcard.css";

const LatestJob = ({ jobs }) => {
  const [latestJobs, setLatestJobs] = useState([]);

  useEffect(() => {
    if (jobs && jobs.length > 0) {
      setLatestJobs(jobs); // Show search results
    } else {
      const fetchJob = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/v1/job/getjob");
          const sortedJob = response.data.jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setLatestJobs(sortedJob.slice(0, 6));
        } catch (error) {
          console.error("Error fetching job", error);
        }
      };
      fetchJob();
    }
  }, [jobs]); // Update when search results change

  return (
    <div className="job-list">
      {latestJobs.length > 0 ? (
        latestJobs.map((job) => <JobCard key={job._id} job={job} />)
      ) : (
        <p>No jobs available</p>
      )}
    </div>
  );
};

export default LatestJob;
