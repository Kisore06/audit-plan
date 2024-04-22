import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import VisibilityIcon from '@mui/icons-material/Visibility';

const AdminRegistration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [role, setRole] = useState([]);
    // const [showSubLines, setShowSubLines] = useState(false);
    const [selectedDateAudit, setSelectedDateAudit] = React.useState('');
    const [selectedDateForTask, setSelectedDateForTask] = useState('');
    const [taskIdForTask, setTaskIdForTask] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

    useEffect(() => {
        fetchRoles().then(setRole);
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:8001/roles');
            return response.data;
        } catch (error) {
            console.error('Error fetching roles:', error);
            return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8001/register', { username, password, roleId });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // const toggleSubLines = (title) => {
    //     setShowSubLines(prevState => ({
    //       ...prevState,
    //       [title]: !prevState[title],
    //     }));
    // };


    const handleDateChangeAudit = (e) => {
        setSelectedDateAudit(e.target.value);
    };

    // const handleView = (area, date) => {
    //     // Construct the URL for navigation
    //     const url = `/audit/${area}/${date}`;
    //     return <Link to={url}><VisibilityIcon/></Link>;
    // };

    const handleStartDateChange = (e) => {
        setDateRange({ ...dateRange, startDate: e.target.value });
    };
   
    const handleEndDateChange = (e) => {
        setDateRange({ ...dateRange, endDate: e.target.value });
    };
   

    const assignTask = async () => {
      if (!selectedDateForTask || !taskIdForTask) {
          alert('Please select a date and enter a Task ID before proceeding.');
          return;
      }
 
      try {
          const response = await fetch(`http://localhost:8001/assignTask`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ date: selectedDateForTask, taskId: taskIdForTask }),
          });
 
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to assign task.');          }
 
          alert('Task assigned successfully.');
          // Optionally, clear the input fields after successful assignment
          setSelectedDateForTask('');
          setTaskIdForTask('');
      } catch (error) {
          console.error('Error:', error);
          alert(error.message);
      }
  };

    return (
<div className="flex-container">
        <div className="card-container">
            <div className="card-title">Register New User</div>
            <div className="card-content">
                <form className="admin-registration-form-container" onSubmit={handleSubmit}>
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
        </div>
            <div className="card-container">
            <div className="card-title">Check Audits</div>
            <div className="card-content">
                <input type="date" value={selectedDateAudit} onChange={handleDateChangeAudit} />
                <Link className="view-button" to={`/checkAudits/${selectedDateAudit}`}
                    onClick={(e) => {
                        if (!selectedDateAudit) {
                            e.preventDefault();
                            alert('Please select a date before proceeding.');
                        }
                    }}>
                    <VisibilityIcon />
                </Link>
            </div>
        </div>

        <div className="card-container">
            <div className="card-title">Assign Task ID for audit</div>
            <div className="card-content">
                <input type="date" value={selectedDateForTask} onChange={(e) => setSelectedDateForTask(e.target.value)} />
                <input type="text" value={taskIdForTask} onChange={(e) => setTaskIdForTask(e.target.value)} placeholder="Enter Task ID" />
                <button className="assign-button" onClick={assignTask}>Assign Task</button>
            </div>
        </div>

    {/* view assigned taska and mark the progress within a date range */}
    <div className="card-container">
            <div className="card-title">Check Assigned Tasks</div>
            <div className="card-content">
                <p>Start date:</p>
                <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={handleStartDateChange}
                    placeholder="Start Date"
                    className="date-range"
                />
                <p>End date:</p>
                <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={handleEndDateChange}
                    placeholder="End Date"
                    className="date-range"
                />
                <Link
                    className="view-button"
                    to={`/assignWork/${dateRange.startDate}/${dateRange.endDate}`}
                    onClick={(e) => {
                        if (!dateRange.startDate || !dateRange.endDate) {
                            e.preventDefault();
                            alert('Please select both a start date and an end date before proceeding.');
                        }
                    }}
                >
                    <VisibilityIcon />
                </Link>
            </div>
        </div>
        </div>
    );
}

export default AdminRegistration;
