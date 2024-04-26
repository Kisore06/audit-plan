import React, {useState, useEffect} from 'react'
import './WeeklyAudit.css' 
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from 'react-router-dom';
import api from "../../utils/api";

const WeeklyAudit = () => {
    const navigate = useNavigate();
    const [showSubLines, setShowSubLines] = useState(false);
    const [selectedDates, setSelectedDates] = useState('');
    const [selectedDateAudit, setSelectedDateAudit] = React.useState('');
    const [selectedDateForTask, setSelectedDateForTask] = useState('');
    const [taskIdForTask, setTaskIdForTask] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if ( userRole !== 'admin') {
            navigate('/');
        }
        
    }, [navigate]);

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
        const url = `/audit/${area}/${date}`;
        return <Link to={url}><VisibilityIcon/></Link>;
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
    <div style={{ paddingTop: '90px', overflow: 'auto' }}>
    <div>
        <h2 className="he2">Remote Area - Weekly Audit Plan</h2>
    </div>
    <div className="button-container">
        <button className="action-button"><a href='/audit' style={{textDecoration:'none', color:'white'}}>Audit places</a></button>
    </div>
    <div>
    <h3 className="he3" onClick={() => toggleSubLines('mainAuditorium')}>1. Main Auditorium Backside</h3>
      {showSubLines['mainAuditorium'] && (
        <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Main Auditorium Backside - male', e.target.value)} />
                <button className="view-button">
                    {handleView('Main Auditorium Backside - male', selectedDates['Main Auditorium Backside - male'])}
                </button>
            </div>
            <h3 className="sub-list">Female</h3>
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
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Learning Centre Backside - male', e.target.value)} />
                <button className="view-button">
                    {handleView('Learning Centre Backside - male', selectedDates['Learning Centre Backside - male'])}
                </button>
            </div>
            <h3 className="sub-list">Female</h3>
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
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Football Playground Restroom - male', e.target.value)} />
                <button className="view-button">
                    {handleView('Football Playground Restroom - male', selectedDates['Football Playground Restroom - male'])}
                </button>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Football Playground Restroom - female', e.target.value)} />
                <button className="view-button">
                    {handleView('Football Playground Restroom - female', selectedDates['Football Playground Restroom - female'])}
                </button>
            </div>
          </div>
      )}

      <h3 className="he3" onClick={() => toggleSubLines('sfBlock')}>4. SF block - VIP lounge </h3>
      {showSubLines['sfBlock'] && (
        <div className="date-view-container">
            <input type="date" className="date-input" onChange={(e) => handleDateChange('SF Block VIP Lounge', e.target.value)} />
            <button className="view-button">
                {handleView('SF Block VIP Lounge', selectedDates['SF Block VIP Lounge'])}
            </button>
        </div>
      )}

      <h3 className="he3" onClick={() => toggleSubLines('vedanayagam')}>5. Vedanayagam Auditorium - VIP lounge</h3>
      {showSubLines['vedanayagam'] && (
          <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Vedanayagam Auditorium VIP Lounge - male', e.target.value)} />
                <button className="view-button">
                    {handleView('Vedanayagam Auditorium VIP Lounge - male', selectedDates['Vedanayagam Auditorium VIP Lounge - male'])}
                </button>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Vedanayagam Auditorium VIP Lounge - female', e.target.value)} />
                <button className="view-button">
                    {handleView('Vedanayagam Auditorium VIP Lounge - female', selectedDates['Vedanayagam Auditorium VIP Lounge - female'])}
                </button>
            </div>
          </div>
      )}

      <h3 className="he3" onClick={() => toggleSubLines('mobile')}>6. Mobile toilet located near to, </h3>
      {showSubLines['mobile'] && (
        <div>
        <h3 className="sub-list">a. New Store Room</h3>
        <div className="date-view-container">
            <input type="date" className="date-input" onChange={(e) => handleDateChange('New Store Room', e.target.value)} />
            <button className="view-button">
                {handleView('New Store Room', selectedDates['New Store Room'])}
            </button>
        </div>
        <h3 className="sub-list">b. Tennis Ground </h3>
        <div className="date-view-container">
            <input type="date" className="date-input" onChange={(e) => handleDateChange('Tennis Ground', e.target.value)} />
            <button className="view-button">
                {handleView('Tennis Ground', selectedDates['Tennis Ground'])}
            </button>
        </div>
        <h3 className="sub-list">c. Quarters</h3>
        <div className="date-view-container">
            <input type="date" className="date-input" onChange={(e) => handleDateChange('Quarters', e.target.value)} />
            <button className="view-button">
                {handleView('Quarters', selectedDates['Quarters'])}
            </button>
        </div>
        </div>
      )}
      
      <h3 className="he3" onClick={() => toggleSubLines('indoor')}>7. Indoor Stadium </h3>
      {showSubLines['indoor'] && (
          <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Indoor Stadium - male', e.target.value)} />
                <button className="view-button">
                    {handleView('Indoor Stadium - male', selectedDates['Indoor Stadium - male'])}
                </button>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Indoor Stadium - female', e.target.value)} />
                <button className="view-button">
                    {handleView('Indoor Stadium - female', selectedDates['Indoor Stadium - female'])}
                </button>
            </div>
          </div>
      )}
      
      <h3 className="he3" onClick={() => toggleSubLines('parking')}>8. Main Parking - Restrooms </h3>
      {showSubLines['parking'] && (
          <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Indoor Stadium - female', e.target.value)} />
                <button className="view-button">
                    {handleView('Indoor Stadium - female', selectedDates['Indoor Stadium - female'])}
                </button>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Indoor Stadium - female', e.target.value)} />
                <button className="view-button">
                    {handleView('Indoor Stadium - female', selectedDates['Indoor Stadium - female'])}
                </button>
            </div>
          </div>
      )}
      <h3 className="he3" onClick={() => toggleSubLines('hostel')}>9. Boys Hostel Canteen Premises </h3>
      {showSubLines['hostel'] && (
          <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Boys Hostel Canteen - male', e.target.value)} />
                <button className="view-button">
                    {handleView('Boys Hostel Canteen - male', selectedDates['Boys Hostel Canteen - male'])}
                </button>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Boys Hostel Canteen - female', e.target.value)} />
                <button className="view-button">
                    {handleView('Boys Hostel Canteen - female', selectedDates['Boys Hostel Canteen - female'])}
                </button>
            </div>
          </div>
      )}

      <h3 className="he3" onClick={() => toggleSubLines('girls-hostel')}>10. Girls Hostel Canteen Premises </h3>
      {showSubLines['girls-hostel'] && (
          <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Girls Hostel Canteen - male', e.target.value)} />
                <button className="view-button">
                    {handleView('Girls Hostel Canteen - male', selectedDates['Girls Hostel Canteen - male'])}
                </button>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Girls Hostel Canteen - female', e.target.value)} />
                <button className="view-button">
                    {handleView('Girls Hostel Canteen - female', selectedDates['Girls Hostel Canteen - female'])}
                </button>
            </div>
          </div>
      )}

      <h3 className="he3" onClick={() => toggleSubLines('music-club')}>11. Music Club </h3>
      {showSubLines['music-club'] && (
        <div className="date-view-container">
            <input type="date" className="date-input" onChange={(e) => handleDateChange('Music club', e.target.value)} />
            <button className="view-button">
                {handleView('Music club', selectedDates['Music club'])}
            </button>
        </div>
      )}

      <h3 className="he3" onClick={() => toggleSubLines('old-mech')}>12. Near to Old Mechanical Seminar Hall </h3>
      {showSubLines['old-mech'] && (
        <div>
            <h3 className="sub-list">a. Chairman Room & Chief Executive Room</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Chairman Room & Chief Executive Room', e.target.value)} />
                <button className="view-button">
                    {handleView('Chairman Room & Chief Executive Room', selectedDates['Chairman Room & Chief Executive Room'])}
                </button>
            </div>
        </div>
      )}

    <h3 className="he3" onClick={() => toggleSubLines('board-room')}>13. SF Block Board Room </h3>
    {showSubLines['board-room'] && (
        <div className="date-view-container">
            <input type="date" className="date-input" onChange={(e) => handleDateChange('SF Block Board Room', e.target.value)} />
            <button className="view-button">
                {handleView('SF Block Board Room', selectedDates['SF Block Board Room'])}
            </button>
        </div>
      )}
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

    {/* view assigned tasks and mark the progress within a date range */}
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
    <div className="button-container">
        <button className="action-button"><a href='/admin-register' style={{textDecoration:'none', color:'white'}}>Add New User</a></button>
    </div>

    </div>
  )
}

export default WeeklyAudit;
