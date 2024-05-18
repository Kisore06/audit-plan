import React, {useState, useEffect} from 'react';
import './WeeklyAudit.css' 
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from 'react-router-dom';
import api from "../../utils/api";
import Model from 'react-modal';

const WeeklyAudit = () => {
    const navigate = useNavigate();
    const [selectedDateAudit, setSelectedDateAudit] = React.useState('');
    const [selectedDateForTask, setSelectedDateForTask] = useState('');
    const [taskIdForTask, setTaskIdForTask] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [visible, setVisible] = useState(false);
    const [cavisible, setCAVisible] = useState(false);
    const [stvisible, setSTVisible] = useState(false);
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

    const handleDateChangeAudit = (e) => {
        setSelectedDateAudit(e.target.value);
    };

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
          const response = await fetch(`${api}/assignTask`, {
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
          setSelectedDateForTask('');
          setTaskIdForTask('');
      } catch (error) {
          console.error('Error:', error);
          alert(error.message);
      }
  };
  
       
  return (
    <div className="weekly">
    <div>
        <h2 className="he2">Remote Area - Weekly Audit Plan</h2>
    </div>
    <div className="flex-container">
      <div className="flex-item" onClick={() => setVisible(true)}>Assign Task ID</div>
      <Model isOpen={visible} onRequestClose={()=>setVisible(false)}  style={
    //    {overlay:{
    //         backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    //         backdropFilter: 'blur(2px)',
    //     },
        {content:{
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            // height: '500px',
            // width: '400px',
            borderRadius: '10px',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            }}
        }   >
        <h2>Assign Task ID</h2>
        <div>
        <input type="date" className="date" value={selectedDateForTask} onChange={(e) => setSelectedDateForTask(e.target.value)} />
        </div>
        <div>
        <input type="text" className="date" value={taskIdForTask} onChange={(e) => setTaskIdForTask(e.target.value)} placeholder="Enter Task ID" />
        </div>
        <button className="action-button" onClick={() => { assignTask(); setVisible(false); }}  >Assign Task</button>
      </Model>

      <div className="flex-item" onClick={() => setCAVisible(true)}>Check Audits & Assign Specific Task</div>
      <Model isOpen={cavisible} onRequestClose={()=>setCAVisible(false)} style={
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
            <h2>Chect Audits & Assign Specific Tasks</h2>
            <div className="date-view-audit">
                <input type="date" className="date" value={selectedDateAudit} onChange={handleDateChangeAudit} />
            <Link className="view-button" to={`/checkAudits/${selectedDateAudit}`}
            onClick={(e) => {
                    if (!selectedDateAudit) {
                        e.preventDefault();
                        alert('Please select a date before proceeding.');
                    }
                }}>
                <VisibilityIcon />  <span style={{marginLeft:'5px'}}>View</span>
            </Link>
            </div>
        </Model>

      <div className="flex-item" onClick={() => setSTVisible(true)}>Check Specific Tasks</div>
      <Model isOpen={stvisible} onRequestClose={()=>setSTVisible(false)} style={
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
            <h2>Chect Specific Tasks</h2>
            <div className="date-view-audit">
            <input type="date" className="date" value={selectedDateAudit} onChange={handleDateChangeAudit} />
            <Link className="view-button" to={`/specificTasks/${selectedDateAudit}`}
            onClick={(e) => {
                    if (!selectedDateAudit) {
                        e.preventDefault();
                        alert('Please select a date before proceeding.');
                    }
                }}>
                <VisibilityIcon /> <span style={{marginLeft:'5px'}}>View</span>
            </Link>
            </div>
        </Model>

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

        <div className="flex-item">
            <a href='/user-details' style={{textDecoration:'none', color:'black'}}>User Info</a>
        </div>
        <div className="flex-item">
            <a href='/area-audit' style={{textDecoration:'none', color:'black'}}>Audit Areas</a>
        </div>

    </div>
    </div>
  )
}

export default WeeklyAudit;
