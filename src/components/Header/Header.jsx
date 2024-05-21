import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuRounded, AccountCircle } from "@mui/icons-material";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Logo from "../../Assets/header/Bannari_Amman_Institute_of_Technology_logo.png";
import './Header.css';

function Header(props) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const headerRef = useRef(null);

  useEffect(() => {
    // Function to check if click was outside the component
    const handleClickOutside = (event) => {
      if (headerRef.current &&!headerRef.current.contains(event.target)) {
        handleClose(); // Close the popover if click was outside
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open? 'simple-popover' : undefined;

  return (
    <div
    ref={headerRef}
      className="app-topbar"
      style={{
        backgroundColor: "white",
        display: "flex",
        padding: "10px 25px",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        borderBottomColor: "black"
      }}
    >
      <div style={{ display: "flex", gap: 20,justifyContent: "center" }}>
        <div className="topbar-title-block">
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div onClick={props.sidebar} className="menu-icon sidebar-menu">
              <MenuRounded />
            </div>
            <img width={30} src={Logo} alt="logo" />
          </div>
        </div>
        {/* <h3 className="topbar-title">Audit</h3> */}

      </div>
      <div className='title'>
      <h3 className="topbar-title">Audit</h3>
      </div>
      {isLoggedIn && (
        <div className="topbar-account" onClick={handleClick}>
          <AccountCircle />
          <Typography sx={{ p: 2 }}>{username}</Typography>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ p: 1 }}>
              <Typography sx={{ p: 1 }} onClick={handleLogout}>Logout</Typography>
            </Box>
          </Popover>
        </div>
      )}
    </div>
  );
}

export default Header;
