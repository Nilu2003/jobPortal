import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Headers from '../UI/Headers';
import AdminHeader from '../UI/AdminHeader';
import Footers from '../UI/Footers';

const AppLayout = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "student");

  useEffect(() => {
    const handleAuthChange = () => {
      const updatedRole = localStorage.getItem("role") || "student";
      console.log("Auth changed! New role:", updatedRole);
      setRole(updatedRole);
    };
  
    window.addEventListener("authChange", handleAuthChange);
  
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);
  

  return (
    <div>
      {role === "admin" ? <AdminHeader /> : <Headers />}
      <Outlet />
      <Footers />
    </div>
  );
};

export default AppLayout;
