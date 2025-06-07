import React, { useState } from "react";
import './CSS/PasswordUpdate.css';
import { Link } from 'react-router-dom';

const PasswordUpdate = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    
    if (newPassword === currentPassword) {
      setErrorMessage("The password you updated is the same as the previous one, please try another password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(newPassword)) {
      setErrorMessage(
        "Password must be at least 10 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number."
      );
      return;
    }

    console.log("Password update request sent:", formData);
    setErrorMessage("");
    alert("Your password has been updated successfully.");
  };

  return (
    <div className="password-update-container">
      <h1>Password Update</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="currentPassword">Current Password</label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />

        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <p className="password-requirements">
          Password must be at least 10 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number.
        </p>

        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit">Update Password</button>
      </form>
      <div className="back-to-login">
        <Link to="/login" style={{ textDecoration: 'none', color: '#007BFF' }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default PasswordUpdate;
