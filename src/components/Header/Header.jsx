import React from 'react';
import './Header.css';
import logo from '../../Assets/header/Bannari_Amman_Institute_of_Technology_logo.png'

const Header = () => {
 return (
    <header className="header">
    <div className="header-container">
      <img src={logo} alt="Logo" className="logo" />
      <h1>Audit Plan</h1>
    </div>
    </header>
 );
};

export default Header;
