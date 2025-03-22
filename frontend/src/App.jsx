import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import Home from "./Pages/Home";
import AllJob from "./Pages/AllJob";
import Applied from "./Pages/Applied";
import Contact from "./Pages/Contact";
import AppLayout from "./Layout.jsx/AppLayout";
import ErrorPage from "./Layout.jsx/ErrorPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ApplyNow from "./Components/ApplyNow";



const router = createBrowserRouter([
  {
    path:"/",
    element:<AppLayout />,
    errorElement:<ErrorPage />,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/all-job",
        element:<AllJob/>
      },
      {
        path:"/applied",
        element:<Applied />
      },
      {
        path:"/login",
        element:<Login />
      },
      {
        path:"/signup",
        element:<Signup />
      },
      {
        path:"/contact",
        element:<Contact />
      },
      {
        path:"/apply",
        element:<ApplyNow />
      }
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
