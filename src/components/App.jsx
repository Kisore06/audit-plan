import './App.css';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import Audit from './WeeklyAudit/Audit';
import AuditView from './WeeklyAudit/Auditview';
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
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
