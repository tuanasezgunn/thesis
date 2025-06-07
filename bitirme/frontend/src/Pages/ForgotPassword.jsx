import React from "react";
import './CSS/ForgotPassword.css';
import { Link } from 'react-router-dom'; 

const ForgotPassword = () => {
  return (
    <div className="forgot-password-page">
      <h1>Forgot Password</h1>
      <p>Enter your email to reset your password.</p>
      <input type="email" placeholder="Your email" />
      <button>Send Reset Link</button>
      
     
      <div className="back-to-login">
        <Link to="/login" style={{ textDecoration: 'none', color: '#007BFF' }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;

