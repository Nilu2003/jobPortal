import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import './App.css';
import Home from "./Pages/Home";
import AllJob from "./Pages/AllJob";
import Applied from "./Pages/Applied";
import Contact from "./Pages/Contact";
import AppLayout from "./Layout.jsx/AppLayout";
import ErrorPage from "./Layout.jsx/ErrorPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ApplyNow from "./Components/ApplyNow";
import Admin from "./Layout.jsx/Admin";
import AdminJob from "./Pages/AdminJob";
import ManageUser from "./Pages/MangeUser";
import JobEdit from "./Components/JobEdit";
import CreateJob from "./Components/CreateJob";

// Helper function to protect routes
const ProtectedRoute = ({ element }) => {
  const role = localStorage.getItem("role");
  console.log("Checking role for route:", role);
  return role === "admin" ? element : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/all-job", element: <AllJob /> },
      { path: "/applied", element: <Applied /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/contact", element: <Contact /> },
      { path: "/apply", element: <ApplyNow /> },
      { path: "/admin", element: <ProtectedRoute element={<Admin />} /> }, //Protect route
      {path:"/manage-jobs" ,element:<ProtectedRoute element={<AdminJob /> } />},
      {path:"/manage-users",element:<ProtectedRoute element={<ManageUser /> } />},
      {path:"/job-edit/:jobId",element:<ProtectedRoute element={<JobEdit />} />},
      {path:"/create-job",element:<ProtectedRoute element={<CreateJob />} />}
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
