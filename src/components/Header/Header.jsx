import React from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';
import Verticalnav from "../navbar/Verticalnav";
import logo from '../../Assets/header/Bannari_Amman_Institute_of_Technology_logo.png'

const Header = () => {
  const location = useLocation(); // Use useLocation to get the current route
 
  // Conditionally render Verticalnav based on the current route
  const showVerticalNav = location.pathname !== '/week' || '/audit';

 return (
    <header className="header">
     
    <div className="header-container">
    {showVerticalNav && <Verticalnav />}
      <img src={logo} alt="Logo" className="logo" />
      <h1>Audit Plan</h1>
    </div>
    </header>
 );
};

export default Header;
