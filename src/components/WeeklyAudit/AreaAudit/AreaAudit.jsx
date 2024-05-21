import React, {useState, useEffect} from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from 'react-router-dom';
import Model from 'react-modal';
import './AreaAudit.css'
import AppLayout from '../../AppLayout';

function AreaAudit(){
    return <AppLayout rId={1} body={<Body />}/>
}

const Body = () => {
    const navigate = useNavigate();
    const [onevisible, setOneVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState('');
    const [lcvisible, setLCVisible] = useState(false);
    const [fbvisible, setFBVisible] = useState(false);
    const [sfvisible, setSFVisible] = useState(false);
    const [vnvisible, setVNVisible] = useState(false);
    const [mtvisible, setMTVisible] = useState(false);
    const [isvisible, setISVisible] = useState(false);
    const [mpvisible, setMPVisible] = useState(false);
    const [bhvisible, setBHVisible] = useState(false);
    const [ghvisible, setGHVisible] = useState(false);
    const [mcvisible, setMCVisible] = useState(false);
    const [omvisible, setOMVisible] = useState(false);
    const [brvisible, setBRVisible] = useState(false);

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

    const handleView = (area, date) => {
        const url = `/audit/${area}/${date}`;
        return <Link className="view-button" to={url}><VisibilityIcon /> <span style={{marginLeft:'5px'}}>View</span>
        </Link>;
    };

    const handleDateChange = (area, date) => {
        setSelectedDates(prevDates => ({
            ...prevDates,
            [area]: date,
        }));
    };

  return (
    <div className="area-audit">
      <h2 style={{marginTop:'70px'}}>Audit Areas:</h2>

    <div className="flex-container">
    {/* one- main auditorium */}
        <div className="flex-item" onClick={() => setOneVisible(true)}>
            Main Auditorium Backside
        </div>
        <Model isOpen={onevisible} onRequestClose={()=>setOneVisible(false)} style={
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
            <h2>Main Auditorium Backside</h2>
            <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Main Auditorium Backside - male', e.target.value)} />
                <span>
                    {handleView('Main Auditorium Backside - male', selectedDates['Main Auditorium Backside - male'])}
                </span>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Main Auditorium Backside - female', e.target.value)} />
                <span>
                    {handleView('Main Auditorium Backside - female', selectedDates['Main Auditorium Backside - female'])}
                </span>
            </div>
        </div>
        </Model>

        {/* Lc - lerning centre */}
        <div className="flex-item" onClick={() => setLCVisible(true)}>
            Learning Centre Backside - Restroom
        </div>
        <Model isOpen={lcvisible} onRequestClose={()=>setLCVisible(false)} style={
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
            <h2>Learning Centre Backside - Restroom</h2>
            <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Learning Centre Backside - male', e.target.value)} />
                <span>
                    {handleView('Learning Centre Backside - male', selectedDates['Learning Centre Backside - male'])}
                </span>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Learning Centre Backside - female', e.target.value)} />
                <span>
                    {handleView('Learning Centre Backside - female', selectedDates['Learning Centre Backside - female'])}
                </span>
            </div>
        </div>
        </Model>

        {/* FB- football ground */}
        <div className="flex-item" onClick={() => setFBVisible(true)}>
            Near to Football Playground - Restroms
        </div>
        <Model isOpen={fbvisible} onRequestClose={()=>setFBVisible(false)} style={
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
            <h2>Near to Football Plaground - Restrooms</h2>
            <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Football Playground Restroom - male', e.target.value)} />
                <span>
                    {handleView('Football Playground Restroom - male', selectedDates['Football Playground Restroom - male'])}
                </span>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Football Playground Restroom - female', e.target.value)} />
                <span>
                    {handleView('Football Playground Restroom - female', selectedDates['Football Playground Restroom - female'])}
                </span>
            </div>
        </div>
        </Model>

        {/* SF */}
        <div className="flex-item" onClick={() => setSFVisible(true)}>
            SF block - VIP lounge
        </div>
        <Model isOpen={sfvisible} onRequestClose={()=>setSFVisible(false)} style={
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
            <h2>SF block - VIP lounge</h2>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('SF Block VIP Lounge', e.target.value)} />
                <span>
                    {handleView('SF Block VIP Lounge', selectedDates['SF Block VIP Lounge'])}
                </span>
            </div>
        </Model>

        {/* vn - vedanayagam auditorium */}
        <div className="flex-item" onClick={() => setVNVisible(true)}>
            Vedanayagam Auditorium - VIP lounge
        </div>
        <Model isOpen={vnvisible} onRequestClose={()=>setVNVisible(false)} style={
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
            <h2>Vedanayagam Auditorium - VIP lounge</h2>
            <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Vedanayagam Auditorium VIP Lounge - male', e.target.value)} />
                <span>
                    {handleView('Vedanayagam Auditorium VIP Lounge - male', selectedDates['Vedanayagam Auditorium VIP Lounge - male'])}
                </span>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Vedanayagam Auditorium VIP Lounge - female', e.target.value)} />
                <span>
                    {handleView('Vedanayagam Auditorium VIP Lounge - female', selectedDates['Vedanayagam Auditorium VIP Lounge - female'])}
                </span>
            </div>
        </div>
        </Model>

        {/* mt - mobile toilet */}
        <div className="flex-item" onClick={() => setMTVisible(true)}>
            Mobile toilets
        </div>
        <Model isOpen={mtvisible} onRequestClose={()=>setMTVisible(false)} style={
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
            <h2>Mobile toilet located near to,</h2>
            <div>
        <h3 className="sub-list">a. New Store Room</h3>
        <div className="date-view-container">
            <input type="date" className="date-input" onChange={(e) => handleDateChange('New Store Room', e.target.value)} />
            <span>
                {handleView('New Store Room', selectedDates['New Store Room'])}
            </span>
        </div>
        <h3 className="sub-list">b. Tennis Ground </h3>
        <div className="date-view-container">
            <input type="date" className="date-input" onChange={(e) => handleDateChange('Tennis Ground', e.target.value)} />
            <span>
                {handleView('Tennis Ground', selectedDates['Tennis Ground'])}
            </span>
        </div>
        <h3 className="sub-list">c. Quarters</h3>
        <div className="date-view-container">
            <input type="date" className="date-input" onChange={(e) => handleDateChange('Quarters', e.target.value)} />
            <span>
                {handleView('Quarters', selectedDates['Quarters'])}
            </span>
        </div>
        </div>
        </Model>

        {/*is- Indoor stadium */}
        <div className="flex-item" onClick={() => setISVisible(true)}>
            Indoor Stadium
        </div>
        <Model isOpen={isvisible} onRequestClose={()=>setISVisible(false)} style={
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
            <h2>Indoor Stadium</h2>
            <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Indoor Stadium - male', e.target.value)} />
                <span>
                    {handleView('Indoor Stadium - male', selectedDates['Indoor Stadium - male'])}
                </span>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Indoor Stadium - female', e.target.value)} />
                <span>
                    {handleView('Indoor Stadium - female', selectedDates['Indoor Stadium - female'])}
                </span>
            </div>
        </div>
        </Model>

        {/* MP - MAin Parking */}
        <div className="flex-item" onClick={() => setMPVisible(true)}>
            Main Parking - Restrooms
        </div>
        <Model isOpen={mpvisible} onRequestClose={()=>setMPVisible(false)} style={
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
            <h2>Main Parking - Restrooms</h2>
            <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Indoor Stadium - female', e.target.value)} />
                <span>
                    {handleView('Indoor Stadium - female', selectedDates['Indoor Stadium - female'])}
                </span>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Indoor Stadium - female', e.target.value)} />
                <span>
                    {handleView('Indoor Stadium - female', selectedDates['Indoor Stadium - female'])}
                </span>
            </div>
        </div>
        </Model>

        {/* BH- Boys Hostel */}
        <div className="flex-item" onClick={() => setBHVisible(true)}>
            Boys Hostel Canteen Premises
        </div>
        <Model isOpen={bhvisible} onRequestClose={()=>setBHVisible(false)} style={
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
            <h2>Boys Hostel Canteen Premises</h2>
            <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Boys Hostel Canteen - male', e.target.value)} />
                <span>
                    {handleView('Boys Hostel Canteen - male', selectedDates['Boys Hostel Canteen - male'])}
                </span>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Boys Hostel Canteen - female', e.target.value)} />
                <span>
                    {handleView('Boys Hostel Canteen - female', selectedDates['Boys Hostel Canteen - female'])}
                </span>
            </div>
        </div>
        </Model>

        {/* GH- girls Hostel */}
        <div className="flex-item" onClick={() => setGHVisible(true)}>
            Girls Hostel Canteen Premises
        </div>
        <Model isOpen={ghvisible} onRequestClose={()=>setGHVisible(false)} style={
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
            <h2>Girls Hostel Canteen Premises</h2>
            <div>
            <h3 className="sub-list">Male</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Girls Hostel Canteen - male', e.target.value)} />
                <span>
                    {handleView('Girls Hostel Canteen - male', selectedDates['Girls Hostel Canteen - male'])}
                </span>
            </div>
            <h3 className="sub-list">Female</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Girls Hostel Canteen - female', e.target.value)} />
                <span>
                    {handleView('Girls Hostel Canteen - female', selectedDates['Girls Hostel Canteen - female'])}
                </span>
            </div>
        </div>
        </Model>

        {/* mc - music club */}
        <div className="flex-item" onClick={() => setMCVisible(true)}>
            Music Club
        </div>
        <Model isOpen={mcvisible} onRequestClose={()=>setMCVisible(false)} style={
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
            <h2>Music Club</h2>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Music club', e.target.value)} />
                <span>
                    {handleView('Music club', selectedDates['Music club'])}
                </span>
            </div>
        </Model>

        {/* om - old mech */}
        <div className="flex-item" onClick={() => setOMVisible(true)}>
            Near to Old Mechanical Seminar Hall
        </div>
        <Model isOpen={omvisible} onRequestClose={()=>setOMVisible(false)} style={
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
            <h2>Near to Old Mechanical Seminar Hall</h2>
            <div>
            <h3 className="sub-list">a. Chairman Room & Chief Executive Room</h3>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('Chairman Room & Chief Executive Room', e.target.value)} />
                <span>
                    {handleView('Chairman Room & Chief Executive Room', selectedDates['Chairman Room & Chief Executive Room'])}
                </span>
            </div>
        </div>
        </Model>

        {/* br - sf board room */}
        <div className="flex-item" onClick={() => setBRVisible(true)}>
            SF Block Board Room 
        </div>
        <Model isOpen={brvisible} onRequestClose={()=>setBRVisible(false)} style={
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
            <h2>SF Block Board Room</h2>
            <div className="date-view-container">
                <input type="date" className="date-input" onChange={(e) => handleDateChange('SF Block Board Room', e.target.value)} />
                <span>
                    {handleView('SF Block Board Room', selectedDates['SF Block Board Room'])}
                </span>
            </div>
        </Model>

    </div>
    </div>
    )
}

export default AreaAudit
