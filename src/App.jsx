import './App.css';
import React, { useEffect } from 'react';
// import Footer from './components/Footer/Footer';
// import Header from './components/Header/Header';
import Audit from './components/WeeklyAudit/Audit';
import AuditView from './components/WeeklyAudit/Auditview';
import WeeklyAudit from './components/WeeklyAudit/WeeklyAudit';
import {Route, Routes, useNavigate} from "react-router-dom";
import Login from './components/Login/Login';
import AdminRegistration from './components/Admin/Admin';
import CheckAudits from './components/WeeklyAudit/CheckAudit/CheckAudits';
import AssignWork from './components/WeeklyAudit/AssignWork/AssignWork';
import SpecificTask from './components/WeeklyAudit/SpecificTask/SpecificTAsk';
import UserDetails from './components/Users/UserDetails';
// import { ToastContainer } from 'react-toastify';
import Campus from './components/Admin/campus';
import AreaAudit from './components/WeeklyAudit/AreaAudit/AreaAudit';
// import Header from './components/Header/Header';

function App() {
//  const location = useLocation();
 const navigate = useNavigate();

    useEffect(() => {
        const checkSessionExpiry = () => {
            const loginTime = localStorage.getItem('loginTime');
            const sessionTimeout = 6 * 60 * 60 * 1000;

            if (!loginTime || Date.now() - loginTime > sessionTimeout) {
                localStorage.removeItem('role');
                localStorage.removeItem('loginTime');
                navigate('/');
            }
        };

        checkSessionExpiry();

    }, [navigate]);

 return (
    <div id="app">
      {/* <Header /> */}
      {/* {location.pathname !== '/' && <Header/>} */}
      {/* {location.pathname !== '/' && <Header/>} */}
      <Routes>
        {/* <Route path="*" element={<Error />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/week" element={<WeeklyAudit />} />
        <Route path="/area-audit" element={<AreaAudit />} />
        <Route path="/admin-register" element={<AdminRegistration />} />
        <Route path="/user-details" element={<UserDetails />} />
        <Route path="/audit" element={<Audit/>}/>
        <Route path="/campus" element={<Campus />} />
        <Route path="/audit/:area/:date" element={<AuditView />} />
        <Route path="/checkAudits/:date" element={<CheckAudits />} />
        <Route path="/assignWork/:startDate/:endDate" element={<AssignWork />} />
        <Route path="/specificTasks/:date" element={<SpecificTask />} />
      </Routes>
      {/* {location.pathname !== '/' && <Footer/>} */}
    </div>
 );
}

export default App;
