import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      
      {token ? (
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      ) : (
        <>
          <Link to="/login">🔑 Login</Link>
          <Link to="/register">📝 Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;