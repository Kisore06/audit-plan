import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDetails.css';
import api from "../../utils/api";
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import AppLayout from '../AppLayout';



function UserDetails(){
    return <AppLayout rId={1} body={<Body />}/>
}

const Body = () => {
    const [admins, setAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${api}/users`);
                const adminsData = response.data.filter(user => user.role === 1);
                const usersData = response.data.filter(user => user.role === 2);
                setAdmins(adminsData);
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}-${month}-${year} (${hours}:${minutes}:${seconds})` ;
    }

    const handleEditClick = (user) => {
        setEditingUser(user);
    };

    const handleUpdateClick = async (user) => {
        const confirmUpdate = window.confirm(`Are you sure you want to update the user to ${editingUser.username}?`);
        if (confirmUpdate) {
            try {
                await axios.put(`${api}/usersedit/${user.id}`, editingUser);
                const response = await axios.get(`${api}/users`);
                const adminsData = response.data.filter(user => user.role === 1);
                const usersData = response.data.filter(user => user.role === 2);
                setAdmins(adminsData);
                setUsers(usersData);
                setEditingUser(null);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        } else {
            setEditingUser(null);
        }
    };

    const handleDeleteClick = async (userId) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the user?`);
        if (confirmDelete) {
            try {
                await axios.delete(`${api}/users/${userId}`);
                setUsers(users.filter(user => user.id!== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleFieldChange = (event, field) => {
        setEditingUser(prevUser => ({
          ...prevUser,
            [field]: event.target.value
        }));
    };

    return (
        // <div style={{backgroundColor: 'white'}}>
        <div style={{backgroundColor:'white'}}>
        <div style={{paddingBottom:'80px', marginLeft:'10px', marginRight:'10px'}}>
        <div style={{ paddingTop: '90px', overflow: 'auto' }}>
            <h2>Admins</h2>
            <table className="user-details-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        <th>Staff ID</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin) => (
                        <tr key={admin.id}>
                            <td>{admin.id}</td>
                            <td>
                                {editingUser && editingUser.id === admin.id? (
                                    <input
                                        type="text"
                                        value={editingUser.username}
                                        onChange={(event) => handleFieldChange(event, 'username')}
                                    />
                                ) : (
                                    admin.username
                                )}
                            </td>
                            <td>
                                {editingUser && editingUser.id === admin.id? (
                                    <input
                                        type="text"
                                        value={editingUser.firstName}
                                        onChange={(event) => handleFieldChange(event, 'firstName')}
                                    />
                                ) : (
                                    admin.firstName
                                )}
                            </td>
                            <td>
                                {editingUser && editingUser.id === admin.id? (
                                    <input
                                        type="text"
                                        value={editingUser.lastName}
                                        onChange={(event) => handleFieldChange(event, 'lastName')}
                                    />
                                ) : (
                                    admin.lastName
                                )}
                            </td>
                            <td>
                                {editingUser && editingUser.id === admin.id? (
                                    <input
                                        type="text"
                                        value={editingUser.phoneNumber}
                                        onChange={(event) => handleFieldChange(event, 'phoneNumber')}
                                    />
                                ) : (
                                    admin.phoneNumber
                                )}
                            </td>
                            <td>
                                {editingUser && editingUser.id === admin.id? (
                                    <input
                                        type="text"
                                        value={editingUser.staffId}
                                        onChange={(event) => handleFieldChange(event, 'staffId')}
                                    />
                                ) : (
                                    admin.staffId
                                )}
                            </td>
                            <td>{formatDate(admin.created_at)}</td>
                            <td>
                                {editingUser && editingUser.id === admin.id? (
                                    <IconButton aria-label="update" onClick={() => handleUpdateClick(admin)}>
                                        <UpdateIcon />
                                    </IconButton>
                                ) : (
                                    <IconButton aria-label="edit" onClick={() => handleEditClick(admin)}>
                                        <EditIcon />
                                    </IconButton>
                                )}
                                <IconButton aria-label="delete" onClick={() => handleDeleteClick(admin.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button-container">
                <button className="action-button"><a href='/admin-register' style={{textDecoration:'none', color:'white'}}>Add New User</a></button>
            </div>

            <h2>User Details</h2>
            <table className="user-details-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        <th>Staff ID</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                                {editingUser && editingUser.id === user.id? (
                                    <input
                                        type="text"
                                        value={editingUser.username}
                                        onChange={(event) => handleFieldChange(event, 'username')}
                                    />
                                ) : (
                                    user.username
                                )}
                            </td>
                            <td>
                                {editingUser && editingUser.id === user.id? (
                                    <input
                                        type="text"
                                        value={editingUser.firstName}
                                        onChange={(event) => handleFieldChange(event, 'firstName')}
                                    />
                                ) : (
                                    user.firstName
                                )}
                            </td>
                            <td>
                                {editingUser && editingUser.id === user.id? (
                                    <input
                                        type="text"
                                        value={editingUser.lastName}
                                        onChange={(event) => handleFieldChange(event, 'lastName')}
                                    />
                                ) : (
                                    user.lastName
                                )}
                            </td>
                            <td>
                                {editingUser && editingUser.id === user.id? (
                                    <input
                                        type="text"
                                        value={editingUser.phoneNumber}
                                        onChange={(event) => handleFieldChange(event, 'phoneNumber')}
                                    />
                                ) : (
                                    user.phoneNumber
                                )}
                            </td>
                            <td>
                                {editingUser && editingUser.id === user.id? (
                                    <input
                                        type="text"
                                        value={editingUser.staffId}
                                        onChange={(event) => handleFieldChange(event, 'staffId')}
                                    />
                                ) : (
                                    user.staffId
                                )}
                            </td>
                            <td>{formatDate(user.created_at)}</td>
                            <td>
                                {editingUser && editingUser.id === user.id? (
                                    <IconButton aria-label="update" onClick={() => handleUpdateClick(user)}>
                                        <UpdateIcon />
                                    </IconButton>
                                ) : (
                                    <IconButton aria-label="edit" onClick={() => handleEditClick(user)}>
                                        <EditIcon />
                                    </IconButton>
                                )}
                                <IconButton aria-label="delete" onClick={() => handleDeleteClick(user.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
     </div>
     </div>
    );
}

export default UserDetails;
