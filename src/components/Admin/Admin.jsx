import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css'; 
import{useNavigate} from 'react-router-dom';
import api from "../../utils/api"

const fetchRoles = async () => {
    try {
        const response = await axios.get(`${api}/roles`);
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        return [];
    }
};

const AdminRegistration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [role, setRole] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        console.log(userRole)
        if ( userRole !== 'admin') {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        fetchRoles().then(setRole);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${api}/register`, { username, password, roleId});
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="admin-registration-container">
            <form className="admin-registration-form" onSubmit={handleSubmit}>
                <h2>Register New User</h2>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <label htmlFor="role">Role</label>
                <select id="role" value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
                    <option value="">Select Role</option>
                    {role.map(role => (
                        <option key={role.id} value={role.id}>{role.role}</option>
                    ))}
                </select>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default AdminRegistration;
