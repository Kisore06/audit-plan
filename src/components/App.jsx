import './App.css';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import AssignWork from './WeeklyAudit/AssignWork/AssignWork';
import Audit from './WeeklyAudit/Audit';
import AuditView from './WeeklyAudit/Auditview';
import CheckAudits from './WeeklyAudit/CheckAudit/CheckAudits';
import WeeklyAudit from './WeeklyAudit/WeeklyAudit';
import {Route, Routes} from "react-router-dom";

function App() {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<WeeklyAudit />} />
        <Route path="/audit" element={<Audit/>}/>
        <Route path="/audit/:area/:date" element={<AuditView />} />
        <Route path="/checkAudits/:date" element={<CheckAudits />} />
        <Route path="/assignWork/:date" element={<AssignWork />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
