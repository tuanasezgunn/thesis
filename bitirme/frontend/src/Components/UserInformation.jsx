import React, { useState } from 'react';
import './UserInformation.css';

const UserInformation = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '', 
  });

  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'birthDate') {
      const formattedValue = formatBirthDate(value);
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const formatBirthDate = (value) => {
    const parts = value.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;  
    }
    return value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.firstName === originalData.firstName &&
      formData.lastName === originalData.lastName &&
      formData.email === originalData.email &&
      formData.phone === originalData.phone &&
      formData.birthDate === originalData.birthDate
    ) {
      alert('Please update your account.');
    } else {
      alert('User information updated successfully!');
      console.log('Updated User Info:', formData);

      setOriginalData({ ...formData });
    }
  };

  return (
    <form className="user-info-form" onSubmit={handleSubmit}>
      <h2>Update Your Information</h2>
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">E-Mail</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="birthDate">Birth Date</label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          placeholder="dd/mm/yyyy"
        />
        <p className="date-preview"> {formData.birthDate}</p>
      </div>
      <button type="submit" className="update-button">Update</button>
    </form>
  );
};

export default UserInformation;

