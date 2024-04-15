import React, {useState} from 'react'
import './WeeklyAudit.css' 
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';

const WeeklyAudit = () => {
    const [showSubLines, setShowSubLines] = useState(false);
    const [selectedDates, setSelectedDates] = useState('');
    const [selectedDateAudit, setSelectedDateAudit] = React.useState('');
    const [selectedDateForTask, setSelectedDateForTask] = useState('');
    const [taskIdForTask, setTaskIdForTask] = useState('');

    
    const toggleSubLines = (title) => {
        setShowSubLines(prevState => ({
          ...prevState,
          [title]: !prevState[title],
        }));
    };

    const handleDateChange = (area, date) => {
        setSelectedDates(prevDates => ({
            ...prevDates,
            [area]: date,
        }));
    };

    const handleDateChangeAudit = (e) => {
        setSelectedDateAudit(e.target.value);
    };

    const handleView = (area, date) => {
        // Construct the URL for navigation
        const url = `/audit/${area}/${date}`;
        // Use Link to navigate to the AuditView component
        return <Link to={url}><VisibilityIcon/></Link>;
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
    <div style={{ paddingTop: '90px' }}>
    <div>
        <h2 className="he2">Remote Area - Weekly Audit Plan</h2>
    </div>
    <div>
    <h3 className="he3" onClick={() => toggleSubLines('mainAuditorium')}>1. Main Auditorium Backside</h3>
      {showSubLines['mainAuditorium'] && (
        <div>
            <h3 className="sub-list"><a href='/audit'>Male</a></h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Main Auditorium Backside - male', e.target.value)} />
                <button className="view-button">
                    {handleView('Main Auditorium Backside - male', selectedDates['Main Auditorium Backside - male'])}
                </button>
            </div>
            <h3 className="sub-list"><a href='/audit'>Female</a></h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Main Auditorium Backside - female', e.target.value)} />
                <button className="view-button">
                    {handleView('Main Auditorium Backside - female', selectedDates['Main Auditorium Backside - female'])}
                </button>
            </div>
        </div>
      )}
      <h3 className="he3" onClick={() => toggleSubLines('learningCentre')}>2. Learning Centre Backside - Restroom </h3>
      {showSubLines['learningCentre'] && (
        <div>
            <h3 className="sub-list"><a href='/audit'>Male</a></h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Learning Centre Backside - male', e.target.value)} />
                <button className="view-button">
                    {handleView('Learning Centre Backside - male', selectedDates['Learning Centre Backside - male'])}
                </button>
            </div>
            <h3 className="sub-list"><a href='/audit'>Female</a></h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Learning Centre Backside - female', e.target.value)} />
                <button className="view-button">
                    {handleView('Learning Centre Backside - female', selectedDates['Learning Centre Backside - female'])}
                </button>
            </div>
        </div>
      )}
      <h3 className="he3" onClick={() => toggleSubLines('ground')}>3. Near to Football Playground - Restroms </h3>
      {showSubLines['ground'] && (
          <div>
            <h3 className="sub-list"><a href='/audit'>Male</a></h3>
            <h3 className="sub-list"><a href='/audit'>Female</a></h3>
          </div>
      )}
      <h3 className="he3"><a href='/'>4. SF block - VIP lounge </a></h3>
      <h3 className="he3" onClick={() => toggleSubLines('vedanayagam')}>5. Vedanayagam Auditorium - VIP lounge</h3>
      {showSubLines['vedanayagam'] && (
          <div>
            <h3 className="sub-list"><a href='/audit'>Male</a></h3>
            <h3 className="sub-list"><a href='/audit'>Female</a></h3>
          </div>
      )}
      <h3 className="he3"><a href='/'>6. Mobile toilet located near to, </a></h3>
      <h3 className="sub-list"><a href='/audit'>a. New Store Room </a></h3>
      <h3 className="sub-list"><a href='/audit'>b. Tennis Ground </a></h3>
      <h3 className="sub-list"><a href='/audit'>c. Quarters </a></h3>
      <h3 className="he3" onClick={() => toggleSubLines('indoor')}>7. Indoor Stadium </h3>
      {showSubLines['indoor'] && (
          <div>
            <h3 className="sub-list"><a href='/audit'>Male</a></h3>
            <h3 className="sub-list"><a href='/audit'>Female</a></h3>
          </div>
      )}
      <h3 className="he3" onClick={() => toggleSubLines('parking')}>8. Main Parking - Restrooms </h3>
      {showSubLines['parking'] && (
          <div>
            <h3 className="sub-list"><a href='/'>Male</a></h3>
            <h3 className="sub-list"><a href='/'>Female</a></h3>
          </div>
      )}
      <h3 className="he3" onClick={() => toggleSubLines('hostel')}>9. Hostel Canteen Premises </h3>
      {showSubLines['hostel'] && (
          <div>
            <h3 className="sub-list"><a href='/'>Male</a></h3>
            <h3 className="sub-list"><a href='/'>Female</a></h3>
          </div>
      )}
      <h3 className="he3"><a href='/'>10. Music Club </a></h3>
      <h3 className="he3"><a href='/'>11. Near to Old Mechanical Seminar Hall </a></h3>
      <h3 className="sub-list"><a href='/'>a. Chairman Room </a></h3>
      <h3 className="sub-list"><a href='/'>b. Chief Executive Room </a></h3>
      <h3 className="he3"><a href='/'>12. SF Block Board Room </a></h3>
    </div>
    <div className="button-container">
    <button className="action-button" onClick={() => toggleSubLines('checkAudits')} >Check Audits</button>
    {showSubLines['checkAudits'] && (
          <div className="date-view-audit">
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
      )}
    </div>
    <div className="button-container">
        <button className="action-button" onClick={() => toggleSubLines('assignTaskID')}>Assign Task ID for audit</button>
        {showSubLines['assignTaskID'] && (
            <div className="date-view-audit">
                <input type="date" value={selectedDateForTask} onChange={(e) => setSelectedDateForTask(e.target.value)} />
                <input type="text" value={taskIdForTask} onChange={(e) => setTaskIdForTask(e.target.value)} placeholder="Enter Task ID" />
                <button className="assign-button" onClick={assignTask}>Assign Task</button>
            </div>
        )}
    </div>

    <div className="button-container">
    <button className="action-button" onClick={() => toggleSubLines('assignTasks')} >Assign Tasks to Audits</button>
    {showSubLines['assignTasks'] && (
          <div className="date-view-audit">
          <input type="date" value={selectedDateAudit} onChange={handleDateChangeAudit} />
          <Link className="view-button"  to={`assignWork/${selectedDateAudit}`}
           onClick={(e) => {
                if (!selectedDateAudit) {
                    e.preventDefault();
                    alert('Please select a date before proceeding.');
                }
            }}>
            <VisibilityIcon />
          </Link>
          </div>
      )}
    </div>

    </div>
  )
}

export default WeeklyAudit;
