import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Audit from './components/WeeklyAudit/Audit';
import AuditView from './components/WeeklyAudit/Auditview';
import WeeklyAudit from './components/WeeklyAudit/WeeklyAudit';
import {Route, Routes} from "react-router-dom";
import Login from './components/Login/Login';
import AdminRegistration from './components/Admin/Admin';
import CheckAudits from './components/WeeklyAudit/CheckAudit/CheckAudits';
import AssignWork from './components/WeeklyAudit/AssignWork/AssignWork';

function App() {
//  const location = useLocation();

 return (
    <div>
    <Header/>
      {/* {location.pathname !== '/' && <Header/>} */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/week" element={<WeeklyAudit />} />
        <Route path="/admin-register" element={<AdminRegistration />} />
        <Route path="/audit" element={<Audit/>}/>
        <Route path="/audit/:area/:date" element={<AuditView />} />
        <Route path="/checkAudits/:date" element={<CheckAudits />} />
        <Route path="/assignWork/:date" element={<AssignWork />} />
      </Routes>
      {/* {location.pathname !== '/' && <Footer/>} */}
      <Footer/>
    </div>
 );
}

export default App;
