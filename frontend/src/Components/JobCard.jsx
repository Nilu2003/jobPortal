import React from "react";
import "../CSS/jobcard.css";
import { NavLink } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <img src={job.logo} alt={job.companyName} className="job-logo" />
      <div className="job-content">
        <h3 className="job-title">{job.title}</h3>
        <p className="job-company">{job.companyName}</p>
        <p className="job-location">{job.location}</p>
        <p className="job-salary">💰 {job.salary}</p>
        <NavLink to="/apply" state={{ job }}>
          <button className="apply-btn">Apply Now</button>
        </NavLink>
      </div>
    </div>
  );
};

export default JobCard;
