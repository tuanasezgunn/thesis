import React from 'react';
import './Navbar.css';
import navlogo from '../../assets/nav-logo.svg';
import navProfile from '../../assets/nav-profile.svg';

const Navbar = () => {
    return (
        <div className='navbar'>
            <img src={navlogo} alt="" className="nav-logo" style={{ width: '100px', height: 'auto' }} />
            <img src={navProfile} className='nav-profile' alt="" style={{ width: '50px', height: 'auto' }} />
        </div>
    );
};

export default Navbar;
