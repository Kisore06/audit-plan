import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; // Import the CSS file
import '../../Assets/header/bitFullLogo.png';
import '../../Assets/header/13.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const notifySuccess = (message) => {
        toast.success(message, { position: 'bottom-left' });
    };
    
    const notifyError = (message) => {
        toast.error(message, { position: 'bottom-left' });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8001/login', { username, password });
            console.log(response.data);
            const { role } = response.data;

            if (role === 'admin') {
                notifySuccess("Login Successful");
                navigate('/week');
            } else if (role === 'user') {
                notifySuccess("Login Successful");
                navigate('/audit');
            } else {
                notifyError("Unknown role");
                console.error('Unknown role:', role);
            }
        } catch (error) {
            notifyError("Login Failed");
            console.error(error);
        }
    };

    return (
        <div className='total-login-page'>
            <ToastContainer />
            <div className='total-login-card'>
                <div className='login-form-flex'>
                    <div className='card-to-arrange'>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="login-title">LOGIN</div>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                label="Username"
                                variant="outlined"
                                size="small"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
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
