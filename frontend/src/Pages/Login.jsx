import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/auth.css'; // Import CSS file

const Login = () => {
  const [data, setData] = useState({ email: '', password: '', role: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/v1/user/login', data);
      console.log('Login successful:', response.data);
  
      if (response.data.user) {
        localStorage.setItem("auth", "true");
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user details
      }
      
      navigate("/");
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
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
