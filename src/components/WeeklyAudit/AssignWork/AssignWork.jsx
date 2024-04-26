import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AssignWork.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TasksPDFDocument from './Assign'; 

const AssignWork = () => {
 const { startDate, endDate } = useParams();
 const [tasks, setTasks] = useState([]);
 const [remoteAreas, setRemoteAreas] = useState([]); // State to store remote areas


 useEffect(() => {
    // Example fetch tasks logic
    // This is a placeholder. Replace with your actual fetch logic.
    const fetchTasks = async () => {
      try {
        // Simulate fetching tasks from an API
        const response = await fetch(`http://localhost:8001/fetchTasks?startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    const fetchRemoteAreas = async () => {
      try {
        const response = await fetch('http://localhost:8001/remote_area_weekly');
        const data = await response.json();
        setRemoteAreas(data);
      } catch (error) {
        console.error("Failed to fetch remote areas:", error);
      }
    };

    fetchTasks();
 }, [startDate, endDate]);

 // Example formatDate function
 const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
 };

 return (
  <div style={{ paddingTop: '90px', overflow: 'auto' }}>
    <h2>Tasks for {formatDate(startDate)} to {formatDate(endDate)}</h2>
    <PDFDownloadLink
      document={<TasksPDFDocument tasks={tasks} />}
      fileName="tasks.pdf"
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'Download Tasks Report'
      }
    </PDFDownloadLink>
    {/* Render tasks in a table */}
    <table className="assign-work-table">
      <thead>
        <tr>
          <th>Serial Number</th>
          <th>Audit Date</th>
          <th>Task ID</th>
          <th>Audit Area</th>
          <th>Specific Area</th>
          <th>Report Observation</th>
          <th>Remarks</th>
          <th>Suggestions</th>
          <th>Specific Task ID</th>
          <th>Action Taken</th>
          <th>Progress</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <tr key={task.task_id_specific}>
            <td>{index + 1}</td>
            <td>{task.date || 'No data'}</td>
            <td>{task.task_id || 'No data'}</td>
            <td>{task.audit_area}</td>
            <td>{task.specific_area}</td>
            <td>{task.report_observation || 'No data'}</td>
            <td>{task.remarks || 'No data'}</td>
            <td>{task.suggestions || 'No data'}</td>
            <td>{task.task_id_specific || 'No data'}</td>
            <td>{task.action_taken || 'No data'}</td>
            <td>{task.progress || 'No data'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};

export default AssignWork;