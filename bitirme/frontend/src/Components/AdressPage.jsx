import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const AddressPage = () => {
  const navigate = useNavigate(); 
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    district: '',
    Neighborhood: '',
    avenue: '',
    apartment: '',
    doornumber: '',
    floor: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const textFieldsToValidate = [
      'fullName', 'country', 'city', 'district', 'street', 'Neighborhood', 'avenue', 'apartment'
    ];
  
    const textOnlyRegex = /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/;
  
    for (let field of textFieldsToValidate) {
      const value = address[field];
      if (!textOnlyRegex.test(value)) {
        alert(`Geçerli bir ${field} giriniz. Sayılar veya özel karakterler kullanmayınız.`);
        return; 
      }
    }
  

    localStorage.setItem('user-address', JSON.stringify(address));
    navigate('/checkout');
  };
  

  return (
    <div>
      <h2>Address Form </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Name Surname</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={address.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="district">District</label>
          <input
            type="text"
            id="district"
            name="district"
            value={address.district}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="street">Street Name</label>
          <input
            type="text"
            id="street"
            name="street"
            value={address.street}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="Neighborhood">Neighborhood</label>
          <input
            type="text"
            id="Neighborhood"
            name="Neighborhood"
            value={address.Neighborhood}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={address.postalCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="avenue">Avenue</label>
          <input
            type="text"
            id="avenue"
            name="avenue"
            value={address.avenue}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="apartment">Apartment</label>
          <input
            type="text"
            id="apartment"
            name="apartment"
            value={address.apartment}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="doornumber">Door Number</label>
          <input
            type="text"
            id="doornumber"
            name="doornumber"
            value={address.doornumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="floor">Floor</label>
          <input
            type="text"
            id="floor"
            name="floor"
            value={address.floor}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddressPage;
