import React from 'react';
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoIcon from '@mui/icons-material/Info';
import { useEffect,useState } from 'react';

function AppSideBar(props) {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // eslint-disable-next-line
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
// eslint-disable-next-line
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

  // Function to handle navigation
  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <div
      className={props.open? "app-sidebar sidebar-open" : "app-sidebar"}
      style={{
        backgroundColor: "white",
      }}
    >
      <ul className="nav-list">
        <li onClick={() => goToPage('/week')}>
          <HomeIcon />
          Home
        </li>
        <li onClick={() => goToPage('/admin-register')}>
          <PersonAddIcon />
          Add new user
        </li>
        <li onClick={() => goToPage('/user-details')}>
          <InfoIcon />
          User Info
        </li>
        
      </ul>
    </div>
  );
}

export default AppSideBar;
