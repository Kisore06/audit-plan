import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css'; // Import the CSS file

const AdminRegistration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8001/register', { username, password, role });
            console.log(response.data);
            // Handle successful registration, e.g., show a success message or redirect
        } catch (error) {
            console.error(error);
            // Handle errors, e.g., show an error message
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
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default AdminRegistration;
