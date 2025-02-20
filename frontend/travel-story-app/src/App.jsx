import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Home/Home';
import Welcome from './pages/Home/Welcome';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Default route now shows the Welcome page */}
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
};

// Protected Route Component to prevent unauthorized access to the dashboard
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
