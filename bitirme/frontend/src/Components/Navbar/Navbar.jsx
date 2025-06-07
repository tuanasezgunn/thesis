import React, { useContext, useRef, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import { Link } from 'react-router-dom';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
  const [menu, setMenu] = useState("Shop");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  
  const isLoggedIn = !!localStorage.getItem('auth-token');
  const userInfo = JSON.parse(localStorage.getItem('user-info')) || {};
  const userEmail = userInfo.email || "Not Available";
  const username = userInfo.username || "My Account"; 

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-info');
    window.location.reload();
  };

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="logo" />
        <p>AcademicBookResale</p>
      </div>
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => { setMenu("book") }}>
          <Link style={{ textDecoration: 'none' }} to='/book'>Book</Link>
          {menu === "book" && <span className="menu-highlight" />}
        </li>
        <li onClick={() => { setMenu("chat") }}>
          <Link style={{ textDecoration: 'none' }} to='/chat'>Chat</Link>
          {menu === "chat" && <span className="menu-highlight" />}
        </li>
        <li onClick={() => { setMenu("add book") }}>
          <Link style={{ textDecoration: 'none' }} to='/addbook'>Add Book</Link>
          {menu === "addbook" && <span className="menu-highlight" />}
        </li>
      </ul>

      <div className='nav-login-cart'>
        <Link to='/favorites' className="nav-favorites">
          Favorites
        </Link>

        <div className="dropdown">
          <button 
            className="dropdown-button" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            { "My Account"}
          </button>
          <ul className={`dropdown-menu ${isDropdownOpen ? 'dropdown-menu-visible' : ''}`}>
            {isLoggedIn && (
              <li className="dropdown-email" style={{ fontWeight: 'bold' }}>{userEmail}</li>
            )}
            <li>
              <Link to="/userinformation" onClick={() => setIsDropdownOpen(false)}>User Information</Link>
            </li>
            <li>
              <Link to="/myorders" onClick={() => setIsDropdownOpen(false)}>My Orders</Link>
            </li>
            <li>
              <Link to="/listitem" onClick={() => setIsDropdownOpen(false)}>List Item</Link>
            </li>
            {isLoggedIn ? (
              <li onClick={handleLogout}>Logout</li>
            ) : (
              <li>
                <Link to="/login" onClick={() => setIsDropdownOpen(false)}>Login</Link>
              </li>
            )}
          </ul>
        </div>

        <Link to='/cart'>
          <img src={cart_icon} alt='cart icon' style={{ width: '50px', height: '50px' }} />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;