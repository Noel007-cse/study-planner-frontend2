import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SmartPlanner from "./components/SmartPlanner";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <SmartPlanner />
            </ProtectedRoute>
          } />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;