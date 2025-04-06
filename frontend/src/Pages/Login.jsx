import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/auth.css';
import Headers from "../UI/Headers";

const Login = () => {
  const [data, setData] = useState({ email: '', password: '', role: '' });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post('http://jobportal-r2s1.onrender.com/api/v1/user/login', data);
      console.log("API Response:", response.data);
  
      if (response.data.user) {
        localStorage.setItem("auth", "true");
        localStorage.setItem("user", JSON.stringify(response.data.user));
  
        const userRole = response.data.user.role === "recruiter" ? "admin" : "student";
        console.log("Setting role:", userRole);
        localStorage.setItem("role", userRole);
  
        window.dispatchEvent(new Event("authChange")); // ✅ Ensure this is after localStorage updates
  
        navigate(userRole === "admin" ? "/admin" : "/");
      }
    } catch (error) {
      console.log("Login error:", error.response?.data);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };
  
  
   

  return (
    
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Enter your email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Enter your password" required onChange={handleChange} />
        <select name="role" onChange={handleChange} required>
          <option value="">Select a role</option>
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
