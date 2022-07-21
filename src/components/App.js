import React from "react"
import Signup from "./AuthComponents/Signup"
import CompanySignup from "./AuthComponents/CompanySignup"
import Login from "./AuthComponents/Login"
import ForgotPassword from "./AuthComponents/ForgotPassword"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Dashboard from "./Dashboard"
import PrivateRoute from "./PrivateRoute"
import AccountSettings from "./AccountSettings"
import GetStarted from "./GetStarted"
import './App.css'
import Navbar from "./Navbar"
import UpdateProfile from "./UpdateProfile"
import Profile from "./Profile"
import CreateTask from "./CreateTask"
import EditTask from "./EditTask"


function App() {
  return (
    <>
    <body>
    <div className="Container">
    <AuthProvider>
          <Router>
            <AuthProvider>
              <Routes>
              <Route element={<Navbar />}>
                  <Route exact path="/" element={<Dashboard />} />
                </Route>
                <Route element={<Navbar />}>
                  <Route path="/account" element={<PrivateRoute><AccountSettings /></PrivateRoute>} />
                </Route>
                <Route element={<Navbar />}>
                  <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
                </Route>
                <Route element={<Navbar />}>
                  <Route path="/about" element={<div></div>} />
                </Route>
                <Route path="/signup" element={<Signup />} />
                <Route path="/company-signup" element={<CompanySignup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/get-started" element={<PrivateRoute><GetStarted /></PrivateRoute>} />
                <Route element={<Navbar />}>
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                </Route>
                <Route element={<Navbar />}>
                  <Route path="/create-task" element={<PrivateRoute><CreateTask /></PrivateRoute>} />
                </Route>
                <Route element={<Navbar />}>
                  <Route path="/edit-task" element={<PrivateRoute><EditTask /></PrivateRoute>} />
                </Route>
              </Routes>
            </AuthProvider>
          </Router>
    </AuthProvider>
    </div>
    </body>
     </>
  )
}

export default App;
