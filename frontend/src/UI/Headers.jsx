import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../CSS/headers.css";

const Headers = () => {
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
  };
  

  return (
    <div className="container">
      <div className="logo">
        <NavLink to="/">
          <h2>Job Seeker</h2>
        </NavLink>
      </div>
      <ul className="nav">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/all-job">All Jobs</NavLink>
        </li>
        <li>
          <NavLink to="/applied">Applied Jobs</NavLink>
        </li>
        <li>
          <NavLink to="/contact">Contact Us</NavLink>
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

export default Headers;
