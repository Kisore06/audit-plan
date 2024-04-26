import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import api from "../../utils/api"

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(''); 

        if (username.length < 3 || password.length < 3) {
            setError('Username must be at least 3 characters long, and password must be at least 3 characters long.');
            return;
        }

        try {
            const response = await axios.post(`${api}/login`, { username, password });
            console.log(response.data);
            const { role, token } = response.data;
            setUserRole(role);
            localStorage.setItem('username', username);
            localStorage.setItem('role', role);
            localStorage.setItem('userToken', token);
            localStorage.setItem('loginTime', Date.now());
            
            if (role === 'admin') {
                navigate('/week');
                window.location.reload();
            } else if (role === 'user') {
                navigate('/audit');
                window.location.reload();
            } else {
                console.error('Unknown role:', role);
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (userRole === 'user') {
        return <div>You do not have access to this page.</div>;
    }

    return (
        <div className='loginform'>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Log In</h2>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Log In</button>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
}

export default Login;
