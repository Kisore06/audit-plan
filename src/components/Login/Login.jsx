import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8001/login', { username, password });
            console.log(response.data);
            const { role } = response.data;

            if (role === 'admin') {
                navigate('/admin-register');
            } else if (role === 'user') {
                navigate('/week');
            } else {
                console.error('Unknown role:', role);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='loginform'>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Log In</h2>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default Login;
