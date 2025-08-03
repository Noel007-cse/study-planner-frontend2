import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiLoader, FiCheck } from 'react-icons/fi';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      const res = await axios.post('https://study-planner-backend-prss.onrender.com/api/auth/register', formData);
      setMessage(res.data.message);
      setIsSuccess(true);
      
      // Trigger success animation before navigation
      document.querySelector('.auth-container').classList.add('success-exit');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      document.querySelector('.auth-container').classList.add('shake');
      setTimeout(() => {
        document.querySelector('.auth-container').classList.remove('shake');
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      <div className="auth-container">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us to start organizing your studies</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" disabled={isLoading} className="auth-button">
              {isLoading ? (
                <>
                  <FiLoader className="spin" /> Creating Account...
                </>
              ) : (
                <>
                  <FiUser /> Register
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="success-animation">
            <div className="success-icon">
              <FiCheck />
            </div>
            <p>Account created successfully!</p>
          </div>
        )}
        
        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
