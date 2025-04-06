import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/auth.css'; // Import CSS file

const Signup = () => {
  const [data, setData] = useState({ fullname: '', phoneNumber: '', email: '', password: '', role: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://jobportal-r2s1.onrender.com/api/v1/user/register', data);
      console.log('Signup successful:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullname" placeholder="Full Name" required onChange={handleChange} />
        <input type="number" name="phoneNumber" placeholder="Phone Number" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <select name="role" onChange={handleChange} required>
          <option value="">Select a role</option>
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
