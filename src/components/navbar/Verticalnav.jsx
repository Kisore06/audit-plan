import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoIcon from '@mui/icons-material/Info';
import PlaceIcon from '@mui/icons-material/Place';
import LogoutIcon from '@mui/icons-material/Logout';

function AppSideBar(props) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUsername && storedRole) {
      setUsername(storedUsername);
      setUserRole(storedRole); // Set the user's role
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setUsername('');
      setUserRole('');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginTime');
    setIsLoggedIn(false);
    setUsername('');
    setUserRole('');
    navigate('/');
    window.location.reload();
  };

  const goToPage = (path) => {
    navigate(path);
  };

  // Determine the home path based on the user's role
  const getHomePath = () => {
    switch(userRole) {
      case 'admin':
        return '/week';
      case 'executer':
        return '/campus';
      default:
        return '/';
    }
  };

  return (
    <div
      className={props.open? "app-sidebar sidebar-open" : "app-sidebar"}
      style={{ backgroundColor: "white" }}
    >
      <ul className="nav-list">
        {/* Use the getHomePath function to determine the correct home path */}
        <li onClick={() => goToPage(getHomePath())}>
          <HomeIcon />
          Home
        </li>
        {/* Conditionally render menu items based on user role */}
        {(userRole === 'admin') && (
          <>
            <li onClick={() => goToPage('/admin-register')}>
              <PersonAddIcon />
              Add new user
            </li>
            <li onClick={() => goToPage('/user-details')}>
              <InfoIcon />
              User Info
            </li>
            <li onClick={() => goToPage('/area-audit')}>
              <PlaceIcon />
              Audit Areas
            </li>
          </>
        )}
        <div className='logout'>
        {isLoggedIn && (
          <li onClick={handleLogout}>
            <LogoutIcon />
            Logout ({username})
          </li>
        )}
        </div>
      </ul>
    </div>
  );
}

export default AppSideBar;
