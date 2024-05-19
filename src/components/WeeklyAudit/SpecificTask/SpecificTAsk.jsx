import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../../../utils/api";
import './SpecificTask.css'; 
import AppLayout from '../../AppLayout';

function SpecificTask(){
  return <AppLayout rId={1} body={<Body />}/>
}

const Body = () => {
 const navigate = useNavigate();
 const { date } = useParams();
 const [remoteAreaData, setRemoteAreaData] = useState([]);
 const [specificTasksData, setSpecificTasksData] = useState([]);
 const [combinedData, setCombinedData] = useState([]);
 const [noDataMessage, setNoDataMessage] = useState('');
 const [taskId, setTaskId] = useState('')

  
 useEffect(() => {
      const userRole = localStorage.getItem('role');
      if ( userRole !== 'admin') {
          navigate('/');
      }
 }, [navigate]);

 useEffect(() => {
    const fetchRemoteAreaData = async () => {
      try {
        const response = await fetch(`${api}/remote_area_weekly`);
        const data = await response.json();
        setRemoteAreaData(data);
      } catch (error) {
        console.error('Error fetching remote area data:', error);
      }
    };

    const fetchSpecificTasksData = async () => {
      try {
        const response = await fetch(`${api}/specific?date=${date}`);
        const data = await response.json();
        if (data.length === 0) {
          // If the data array is empty, set a message indicating no data for the date
          setNoDataMessage(`No specific tasks data for date: ${date}. You can check with the range of assigned tasks or checkaudits page`);
        } else {
          // If there is data, clear the no data message and set the data
          setNoDataMessage('');
          setSpecificTasksData(data);
        }
      } catch (error) {
        console.error('Error fetching specific tasks data:', error);
      }
    };

    const fetchTaskId = async () => {
      try {
          const response = await fetch(`${api}/getTaskIdByDate?date=${date}`);
          if (!response.ok) {
              throw new Error(`Error fetching taskId for date: ${date}`);
          }
          const data = await response.json();
          setTaskId(data.taskId);
      } catch (error) {
          console.error('Error fetching taskId:', error);
      }
  };

    fetchRemoteAreaData();
    fetchSpecificTasksData();
    fetchTaskId();
 }, [date]);

 useEffect(() => {
    if (remoteAreaData.length > 0 && specificTasksData.length > 0) {
      const combined = combineData(remoteAreaData, specificTasksData);
      setCombinedData(combined);
    }
 }, [remoteAreaData, specificTasksData]);

 const combineData = (remoteAreaData, specificTasksData) => {
    const specificTasksMap = specificTasksData.reduce((acc, task) => {
       const key = `${task.audit_area}-${task.specific_area}`;
       acc[key] = task;
       return acc;
    }, {});
    
 
    const combinedData = remoteAreaData.map(area => {
       const key = `${area.area}-${area.area_gender}`;
       const specificTask = specificTasksMap[key] || {};
 
       return {
         ...area,
         ...specificTask,
         report_observation: specificTask.report_observation || 'No discrepancies found' ,
         remarks: specificTask.remarks || 'good, good, good, good, good, good, good',
         suggestions: specificTask.suggestions ,
         task_id_specific: specificTask.task_id_specific ,
         action_taken: specificTask.action_taken ,
         progress: specificTask.progress ,
       };
    });
 
    return combinedData;
 };

 const groupDataByArea = (data) => {
  return data.reduce((acc, item) => {
     const key = item.area;
     if (!acc[key]) {
       acc[key] = [];
     }
     acc[key].push(item);
     return acc;
  }, {});
 };
 
 const groupedData = groupDataByArea(combinedData);

 const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

//week number
const parsedDate = new Date(date);

// Extract the month and year
const month = parsedDate.toLocaleString('default', { month: 'long' });
const year = parsedDate.getFullYear();

// Calculate the week number of the month
const firstDayOfMonth = new Date(year, parsedDate.getMonth(), 1);
const pastDaysOfMonth = (parsedDate - firstDayOfMonth) / 86400000;
const weekNumber = Math.ceil((pastDaysOfMonth + firstDayOfMonth.getDay() + 1) / 7);

// Format the month, year, and week number
const analysisWeek = `${month} ${year} (week ${weekNumber})`;

const completedTasksCount = combinedData.filter(task => task.progress === "Completed").length;
const pendingTasksCount = combinedData.filter(task => task.progress === "In Progress").length;
const TasksCount = combinedData.filter(task => task.task_id_specific).length;


////server side pdf download
const sendDataAndDownloadPDF = async () => {
  const formattedDate = formatDate(date);

  const dataToSend = {
      
      date: formattedDate,
      taskId: taskId,
      analysisWeek: analysisWeek,
      completedTasksCount,
      pendingTasksCount,
      TasksCount,
      auditsData: Object.entries(groupedData).flatMap(([areaName, areaData]) =>
        areaData.map((item) => ({
          AuditArea: areaName,
          SpecificArea: item.area_gender,
          ReportObservation: item.report_observation,
          Remarks: item.remarks,
          Suggestions: item.suggestions,
          TaskIDSpecific: item.task_id_specific,
          ActionTaken: item.action_taken,
          Progress: item.progress,
    }))
 ),
  };

  try {
      const response = await fetch(`${api}/generate-pdf2`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Specific Task Report-${analysisWeek}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
  }
};


 return (
  <div className="task-table-container">
  {noDataMessage && <p className="no-data-message">{noDataMessage}</p>}
    <div style={{ textAlign: "center" }}>
        <h2>Specific Task Report</h2>
        <h4 >Remote Area Analysis Report - {analysisWeek}</h4>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>Audit Date: {formatDate(date)}</div>
        <div>Task ID: {taskId}</div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>Number of Tasks: {TasksCount}</div>
        <div>Completed Tasks: {completedTasksCount}</div>
        <div>Pending Tasks: {pendingTasksCount}</div>
    </div>
      <table className="task-table">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Area</th>
            <th>Specific Area</th>
            <th>Report Observation</th>
            <th>Remarks</th>
            <th>Task ID Specific</th>
            <th>Action Taken</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
        {Object.entries(groupedData).map(([areaName, areaData], index) => (
          <React.Fragment key={index}>
            {areaData.map((item, itemIndex) => (
              <tr key={itemIndex}>
                {itemIndex === 0 && <td rowSpan={areaData.length}>{index + 1}</td>}
                {itemIndex === 0 && <td rowSpan={areaData.length}>{item.area}</td>}
                <td>{item.area_gender}</td>
                <td dangerouslySetInnerHTML={{ __html: item.report_observation }}></td>
                <td>{item.remarks}</td>
                <td>{item.task_id_specific}</td>
                <td>{item.action_taken}</td>
                <td>{item.progress}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
      </table>

      <button className="action-button" onClick={sendDataAndDownloadPDF}>Download PDF</button>

    </div>
 );
}

export default SpecificTask;
