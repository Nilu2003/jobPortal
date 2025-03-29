import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../CSS/headers.css";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(localStorage.getItem("auth") === "true");

  useEffect(() => {
      const handleAuthChange = () => {
        setAuth(localStorage.getItem("auth") === "true");
      };
  
      window.addEventListener("authChange", handleAuthChange);
  
      return () => {
        window.removeEventListener("authChange", handleAuthChange);
      };
    }, []);
    const handleLogout = () => {
      localStorage.removeItem("auth");
      localStorage.removeItem("user");
      localStorage.removeItem("role"); // ✅ Fix: Remove role on logout
      setAuth(false);
      navigate("/login");
      window.dispatchEvent(new Event("authChange"));
      window.location.reload();
    };
    

  return (
    <div className="container">
      <div className="logo">
        <NavLink to="/admin">
          <h2>Admin Dashboard</h2>
        </NavLink>
      </div>
      <ul className="nav">
        <li>
          <NavLink to="/manage-jobs">Manage Jobs</NavLink>
        </li>
        <li>
          <NavLink to="/manage-users">Manage Users</NavLink>
        </li>
      </ul>
      <div className="btn">
        {auth ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <button>
              <NavLink to="/login">Login</NavLink>
            </button>
            <button>
              <NavLink to="/signup">SignUp</NavLink>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
