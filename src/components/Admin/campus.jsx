import React, {useState, useEffect} from 'react'
import './campus.css'; 
import api from '../../utils/api';
import { Button } from '@mui/material'; // Import Button from Material-UI
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from 'react-router-dom';

const Campus = () => {
    const navigate = useNavigate();
    const [showSubLines, setShowSubLines] = useState(false);
    // const [selectedDates, setSelectedDates] = useState('');
    const [tasks, setTasks] = useState([]);
     // eslint-disable-next-line
    const [taskDetails, setTaskDetails] = useState(null);   // const [selectedDateAudit, setSelectedDateAudit] = React.useState('');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if ( userRole !== 'executer') {
            navigate('/');
        }
        
    }, [navigate]);

    useEffect(() => {
        fetch(`${api}/fetchAllSpecificTasks`)
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);

    const fetchTaskDetails = (taskId) => {
        fetch(`${api}/fetchTaskDetails?task_id_specific=${taskId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    setTaskDetails(data[0]); // Assuming you want to display the first task detail
                } else {
                    console.log('No task details found for the provided task_id_specific.');
                }
            })
            .catch(error => console.error('Error fetching task details:', error));
    };

    // Example of calling fetchTaskDetails when a task card is clicked
    const handleTaskCardClick = (taskId) => {
        fetchTaskDetails(taskId);
    };
    

    const toggleSubLines = (title) => {
        setShowSubLines(prevState => ({
          ...prevState,
          [title]: !prevState[title],
        }));
    };



const handleViewDetail = (area, date) => {
    // Format the date to 'YYYY-MM-DD' if necessary
    const formattedDate = date.split('T')[0];
    const url = `/audit/${area}/${formattedDate}`;
    navigate(url);
};

    const handleStartDateChange = (e) => {
        setDateRange({ ...dateRange, startDate: e.target.value });
    };
    
    const handleEndDateChange = (e) => {
        setDateRange({ ...dateRange, endDate: e.target.value });
    };

    
    const formatdate= (utcDateString)=>{
        const date = new Date(utcDateString)
        return date.toLocaleDateString('en-CA');
    }

     // Integrate the handleProgressUpdate function here
     const handleProgressUpdate = async (taskId, newProgress) => {
        const confirmUpdate = window.confirm(`Are you sure you want to update the progress to ${newProgress}?`);
        if (!confirmUpdate) {
            return;
        }
        try {
            const response = await fetch(`${api}/updateTaskProgress?taskId=${taskId}&newProgress=${newProgress}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId, newProgress }),
            });
            if (!response.ok) {
                throw new Error('Failed to update task progress');
            }
            const updatedTask = await response.json();
            setTasks(tasks.map(task => task.task_id_specific === taskId? updatedTask : task));
        } catch (error) {
            console.error('Error updating task progress:', error);
        }
    };

    const inProgressTasks = tasks.filter(task => task.progress === "In Progress");

    
       
  return (
    <div style={{ paddingTop: '90px', overflow: 'auto' }}>
    <div>
        <h2 className="he2">Remote Area - Weekly Audit Plan</h2>
        <p><b>In Complete Tasks:  {inProgressTasks.length}</b></p>
    </div>
    <div className='task-flex'>
            {tasks.map(task => (

                <div key={task.task_id_specific} className="task-card" onClick={() => handleTaskCardClick(task.task_id_specific)}>
                    <div>
                    <h3>Task ID: {task.task_id_specific}</h3>
                    <p>Date: {formatdate(task.date)}</p>
                    {/* <p>Audit Area: {task.audit_area}</p> */}
                    <p>Area: {task.specific_area}</p>
                    <p>Action Taken: {task.action_taken}</p>
                    <p>progress: {task.progress}</p>
                    </div>
                    <Button variant="contained" size="small" onClick={() => handleProgressUpdate(task.task_id_specific, "Completed")}>Mark as Completed</Button>
                    <Button variant="contained" size="small" onClick={() => handleViewDetail(task.specific_area, formatdate(task.date))}>Show Details</Button>

                    {/* Add more task details as needed */}
                </div>
            ))}
            </div>
            
        
   
    <div className="button-container">
    <button className="action-button" onClick={() => toggleSubLines('assignTasks')}>Check Assigned Tasks</button>
    {showSubLines['assignTasks'] && (
        <div className="date-view-audit">
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
        )}
    </div>

    </div>
  )
}

export default Campus;