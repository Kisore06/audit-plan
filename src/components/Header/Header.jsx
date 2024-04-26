import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../../Assets/header/Bannari_Amman_Institute_of_Technology_logo.png';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useNavigate } from 'react-router-dom';

const Header = () => {
 const navigate = useNavigate();
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [username, setUsername] = useState('');

 useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUsername && storedRole) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
 }, []);

 const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginTime');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
    window.location.reload();
 };


 return (
    <header className="header">
      <div className="header-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Audit Plan</h1>
        {isLoggedIn && (
          <div className="user-info">
            <div className="dropdown">
              <PersonOutlineIcon />
              <div className="dropdown-content">
                <p style={{paddingLeft:'10px'}}> {username} </p>
                <a href="/" onClick={handleLogout}>Logout</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
 );
};

export default Header;
