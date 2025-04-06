import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/manageUser.css"; 

const ManageUser = () => {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Get recruiter details from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const recruiterId = storedUser?._id; // Assuming user._id is the recruiter's ID
        if (!recruiterId) {
          console.error("Recruiter ID not found in localStorage.");
          return;
        }

        const response = await axios.get(`http://jobportal-r2s1.onrender.com/api/v1/application/recruiter-applications/${recruiterId}`);
        console.log(response);
        
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/application/get-application/${appId}`, { status: newStatus });

      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
      setMessage("Application status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("Failed to update application status.");
    }
  };

  return (
    <div className="manage-user-container">
      <h2>Received Job Applications</h2>
      {message && <p className="message">{message}</p>}
      {applications.length === 0 ? (
        <p>No applications received yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Experience</th>
              <th>Resume</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.fullname}</td>
                <td>{app.email}</td>
                <td>{app.phoneNumber}</td>
                <td>{app.yearsOfExperience} years</td>
                <td>
                  <a href={app.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
                </td>
                <td>{app.jobId?.title || "N/A"}</td>
                <td className={app.status}>{app.status}</td>
                <td>
                  {app.status === "pending" && (
                    <>
                      <button className="accept-btn" onClick={() => handleStatusUpdate(app._id, "accepted")}>Accept</button>
                      <button className="reject-btn" onClick={() => handleStatusUpdate(app._id, "rejected")}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUser;
