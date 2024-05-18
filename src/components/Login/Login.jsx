import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; 
import '../../Assets/header/bitFullLogo.png';
import '../../Assets/header/13.png';
import api from "../../utils/api";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    const notifySuccess = (message) => {
        toast.success(message, { position: 'bottom-left' });
    };

    const notifyError = (message) => {
        toast.error(message, { position: 'bottom-left' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                notifySuccess("Login Successful");
                navigate('/week');
                window.location.reload();
            } else if (role === 'user') {
                notifySuccess("Login Successful");
                navigate('/audit');
                window.location.reload();
            }
            else if (role === 'executer'){
                notifySuccess("Login Successful");
                navigate('/campus');
                window.location.reload();
            }
            else {
                notifyError("Unknown role");
                console.error('Unknown role:', role);
                window.location.reload();
            }
        } catch (error) {
            notifyError("Login Failed");
            console.error(error);
        }
    };

    if (userRole === 'user') {
        return <div>You do not have access to this page.</div>;
    }

    return (
        <div className='total-login-page'>
            <ToastContainer />  
            <div className='total-login-card'>
                <div className='login-form-flex'>
                    <div className='card-to-arrange'>
                        {error && <div className="error-message">{error}</div>}
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="login-title">Audit Manager</div>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                label="Username"
                                variant="outlined"
                                size="small"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{marginBottom:'20px'}}
                            />
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                label="Password"
                                variant="outlined"
                                size="small"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button className="login-button" type="submit">
                                Login
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
