import React, {useState, useEffect} from 'react'
import './campus.css'; 
import api from '../../utils/api';
import { Button } from '@mui/material'; // Import Button from Material-UI
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from 'react-router-dom';
import Model from 'react-modal';

const Campus = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
     // eslint-disable-next-line
    const [taskDetails, setTaskDetails] = useState(null);
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [cstvisible, setCSTVisible] = useState(false);



    //for popup
    useEffect(() => {
        const appElement = document.getElementById('app');
        if (appElement) {
          Model.setAppElement(appElement);
        } else {
          console.error('App element not found');
        }
      }, []);

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if ( userRole !== 'executer' && userRole!== 'admin') {
            navigate('/');
        }
        
    }, [navigate]);

    useEffect(() => {
        fetch(`${api}/fetchAllSpecificTasks`)
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);


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
            window.location.reload(true);
        } catch (error) {
            console.error('Error updating task progress:', error);
        }
    };

    const inProgressTasks = tasks.filter(task => task.progress === "In Progress");
 
  return (
    <div style={{ paddingTop: '90px', overflow: 'auto', marginLeft:'30px', marginRight:'30px', marginBottom:'30px' }}>
    <div>
        <h2 className="he2">Remote Area - Weekly Audit Plan</h2>
        <p><b>In Progress Tasks:  {inProgressTasks.length}</b></p>
    </div>
    <div className='task-flex'>
            {tasks.map(task => (

                <div 
                key={task.task_id_specific} 
                className="task-card" 
                >
                    <div>
                    <h3>Task ID: {task.task_id_specific}</h3>
                    <p>{formatdate(task.date)}</p>
                    {/* <p>Audit Area: {task.audit_area}</p> */}
                    <p>{task.specific_area}</p>
                    <p style={{maxWidth:'290px'}}>{task.action_taken}</p>
                    <p>Status: {task.progress}</p>
                    </div>
                    <Button variant="contained" size="small" onClick={() => handleViewDetail(task.specific_area, formatdate(task.date))}>Show Details</Button>
                    <Button variant="contained" size="small" onClick={() => handleProgressUpdate(task.task_id_specific, "Completed")}>Mark as Completed</Button>

                    {/* Add more task details as needed */}
                </div>
            ))}
            </div>
            
        <div className="flex-container" style={{marginBottom:'20px'}}>
        <div className="flex-item" onClick={() => setCSTVisible(true)}>Check Complete Specific Tasks</div>
        <Model isOpen={cstvisible} onRequestClose={()=>setCSTVisible(false)} style={
            {content:{
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                borderRadius: '10px',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                }}
            }   >
                <h2>Chect Complete Specific tasks</h2>
                <div className="date-view-audit">
                <p>Start date:</p>
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={handleStartDateChange}
                        placeholder="Start Date"
                        className="date-range date"
                    />
                    <p>End date:</p>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={handleEndDateChange}
                        placeholder="End Date"
                        className="date-range date"
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
                        <VisibilityIcon /> <span style={{marginLeft:'5px'}}>View</span>
                    </Link>
                </div>
            </Model>

        </div>
   
    

    </div>
  )
}

export default Campus;