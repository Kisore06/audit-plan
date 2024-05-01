import './App.css';
import React, { useEffect } from 'react';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Audit from './components/WeeklyAudit/Audit';
import AuditView from './components/WeeklyAudit/Auditview';
import WeeklyAudit from './components/WeeklyAudit/WeeklyAudit';
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Login from './components/Login/Login';
import AdminRegistration from './components/Admin/Admin';
import CheckAudits from './components/WeeklyAudit/CheckAudit/CheckAudits';
import AssignWork from './components/WeeklyAudit/AssignWork/AssignWork';
import { ToastContainer } from 'react-toastify';
import Campus from './components/Admin/campus';

function App() {
 const location = useLocation();
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
    <div>
      <ToastContainer />
      {location.pathname !== '/' && <Header/>}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/week" element={<WeeklyAudit />} />
        <Route path="/admin-register" element={<AdminRegistration />} />
        <Route path="/audit" element={<Audit/>}/>
        <Route path="/campus" element={<Campus />} />
        <Route path="/audit/:area/:date" element={<AuditView />} />
        <Route path="/checkAudits/:date" element={<CheckAudits />} />
        <Route path="/assignWork/:startDate/:endDate" element={<AssignWork />} />
      </Routes>
      {location.pathname !== '/' && <Footer/>}
    </div>
 );
}

export default App;
