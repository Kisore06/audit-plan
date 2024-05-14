// SessionTimeout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/authutils'; // Ensure this function is correctly implemented

const SessionTimeout = ({ children }) => {
 const navigate = useNavigate();

 useEffect(() => {
    const checkSession = () => {
      if (isTokenExpired()) {
        navigate('/login'); // Redirect to login page
      }
    };

    // Check the session on component mount
    checkSession();

    // Optionally, set a timeout to check the session periodically
    // const intervalId = setInterval(checkSession, 60000); // 1 minute interval
    // return () => clearInterval(intervalId);
 }, [navigate]);

 return children;
};

export default SessionTimeout;
