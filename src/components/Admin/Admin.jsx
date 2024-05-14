import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css'; 
import { useNavigate } from 'react-router-dom';
import api from "../../utils/api";

// const fetchRoles = async () => {
//     try {
//         const response = await axios.get(`${api}/roles`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching roles:', error);
//         return [];
//     }
// };

const AdminRegistration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [role, setRole] = useState([]);
    const [error, setError] = useState([]);
    const [firstName, setFirstName] = useState(''); // New state variable for first name
    const [lastName, setLastName] = useState(''); // New state variable for last name
    const [phoneNumber, setPhoneNumber] = useState(''); // New state variable for phone number
    const [staffId, setStaffId] = useState(''); // New state variable for staff ID
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        console.log(userRole)
        if (userRole!== 'admin') {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        fetchRoles().then(setRole);
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${api}/roles`);
            return response.data;
        } catch (error) {
            console.error('Error fetching roles:', error);
            return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(''); 

        if (username.length < 3 || password.length < 3) {
            setError('Username must be at least 3 characters long, and password must be at least 3 characters long.');
            return;
        }

        try {
            const response = await axios.post(`${api}/register`, { 
                username, 
                password, 
                roleId,
                firstName,
                lastName,
                phoneNumber,
                staffId
            });
            if (response.status === 200) {
                console.log(response.data);
                window.alert("Registration Succesful!");
                setUsername('');
                setPassword('');
                setRoleId('');
                setFirstName('');
                setLastName('');
                setPhoneNumber('');
                setStaffId('');
                setError('');
            } else {
                console.error('An unexpected error occurred:', response.status);
            }
        } catch (error) {
            console.error(error);
            const errorMessage = 'Username is already taken';
            window.alert(errorMessage);
        }
    };

    // const toggleSubLines = (title) => {
    //     setShowSubLines(prevState => ({
    //       ...prevState,
    //       [title]: !prevState[title],
    //     }));
    // };


    // const handleDateChangeAudit = (e) => {
    //     setSelectedDateAudit(e.target.value);
    // };

    // const handleView = (area, date) => {
    //     // Construct the URL for navigation
    //     const url = `/audit/${area}/${date}`;
    //     return <Link to={url}><VisibilityIcon/></Link>;
    // };

//     const handleStartDateChange = (e) => {
//         setDateRange({ ...dateRange, startDate: e.target.value });
//     };
   
//     const handleEndDateChange = (e) => {
//         setDateRange({ ...dateRange, endDate: e.target.value });
//     };
   

//     const assignTask = async () => {
//       if (!selectedDateForTask || !taskIdForTask) {
//           alert('Please select a date and enter a Task ID before proceeding.');
//           return;
//       }
 
//       try {
//           const response = await fetch(`http://localhost:8001/assignTask`, {
//               method: 'POST',
//               headers: {
//                   'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ date: selectedDateForTask, taskId: taskIdForTask }),
//           });
 
//           if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Failed to assign task.');          }
 
//           alert('Task assigned successfully.');
//           // Optionally, clear the input fields after successful assignment
//           setSelectedDateForTask('');
//           setTaskIdForTask('');
//       } catch (error) {
//           console.error('Error:', error);
//           alert(error.message);
//       }
//   };

    return (
        <div className="admin-registration-container">
            <form className="admin-registration-form" onSubmit={handleSubmit}>
                <h2>Register New User</h2>
                <div className="form">
                    <div className="left-section">
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
                    </div>
                    <div className="right-section">
                        <h3>Additional Details:</h3>
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" required />
                        <label htmlFor="staffId">Staff ID</label>
                        <input type="text" id="staffId" value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="Staff ID" required />
                    </div>
                </div>
                <button type="submit">Register</button>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
}

export default AdminRegistration;
