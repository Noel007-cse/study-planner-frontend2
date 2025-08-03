import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock, FiLoader } from 'react-icons/fi';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await axios.post('https://study-planner-backend-prss.onrender.com/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      
      // Trigger exit animation before navigation
      document.querySelector('.auth-container').classList.add('exiting');
      
      // Wait for animation to complete before navigating
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your Smart Study Planner</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? (
              <>
                <FiLoader className="spin" /> Signing In...
              </>
            ) : (
              <>
                <FiLogIn /> Sign In
              </>
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <a href="/register">Create one</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
