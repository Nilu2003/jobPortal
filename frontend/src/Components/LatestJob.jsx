import { useEffect, useState } from "react";
import axios from "axios"
import JobCard from "./JobCard";
import "../CSS/jobcard.css";


const LatestJob = () => {
    const [jobs,setJobs] =useState([]);
     useEffect(() =>{
        const fetchJob = async() => {
            try {
                const response= await axios.get("http://localhost:8000/api/v1/job/getjob");
                console.log(response);
                const sortedJob=response.data.jobs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
                setJobs(sortedJob.slice(0,6));
            } catch (error) {
                console.error("Error fething job",error);
            }
        }
        fetchJob()
     },[]);
  return (
    <div className="job-list">
        {jobs.length > 0 ? (
        jobs.map((job) => <JobCard key={job._id} job={job} />)
      ) : (
        <p>No jobs available</p>
      )}
    </div>
  )
}

export default LatestJob