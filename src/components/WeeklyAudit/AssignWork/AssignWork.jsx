import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../../utils/api";
// import TasksPDFDocument from './Assign';
// import { BlobProvider } from '@react-pdf/renderer';
// import { saveAs } from 'file-saver'; 

const AssignWork = () => {
    const { startDate, endDate } = useParams();
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const [remoteAreas, setRemoteAreas] = useState([]);
    // const [blob, setBlob] = useState(null);

    // const handleDownload = async () => {
    //     try {
    //         const response = await fetch('http://localhost:8001/assign.php', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //             body: new URLSearchParams({
    //                 tasks: JSON.stringify(tasks),
    //             }),
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to generate PDF');
    //         }
    //         const blob = await response.blob();
    //         saveAs(blob, 'tasks-report.pdf');
    //     } catch (error) {
    //         console.error('Error downloading PDF:', error);
    //     }
    // };
    

     useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (userRole !== 'admin' && userRole !== 'executer' ) {
            navigate('/');
        }
    
        const fetchRemoteAreas = async () => {
            try {
                const response = await fetch(`${api}/remote_area_weekly`);
                if (!response.ok) {
                    throw new Error('Failed to fetch remote areas');
                }
                const data = await response.json();
                setRemoteAreas(data);
            } catch (error) {
                console.error('Error fetching remote areas:', error);
            }
        };
    
        fetchRemoteAreas();
    }, [navigate]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${api}/fetchTasks?startDate=${startDate}&endDate=${endDate}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
    
        if (remoteAreas.length > 0) {
            fetchTasks();
        }
    }, [startDate, endDate, remoteAreas, navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const completedTasksCount = tasks.filter(task => task.progress === 'Completed').length;
    const pendingTasksCount = tasks.filter(task => task.progress === 'In Progress').length;
    const TasksCount = tasks.filter(task => task.task_id_specific).length;

    // Preprocess tasks to group by Audit Area and Specific Area
    const groupedTasks = tasks.reduce((acc, task) => {
        if (!acc[task.audit_area]) {
            acc[task.audit_area] = {
                specificAreas: {},
                serialNumber: 1, // Start serial number for this audit area
            };
        }
        if (!acc[task.audit_area].specificAreas[task.specific_area]) {
            acc[task.audit_area].specificAreas[task.specific_area] = [];
        }
        acc[task.audit_area].specificAreas[task.specific_area].push(task);
        return acc;
    }, {});

    // Function to render grouped tasks with row spans and merged cells
    const renderGroupedTasks = () => {
        return Object.entries(groupedTasks).map(([auditArea, { specificAreas, serialNumber }], auditAreaIndex) => {
            return (
                <>
                    {Object.entries(specificAreas).map(([specificArea, tasks], index) => {
                        const isFirstSpecificArea = index === 0;
                        return tasks.map((task, taskIndex) => {
                            const isFirstTaskInSpecificArea = taskIndex === 0;
                            return (
                                <tr key={task.task_id_specific}>
                                    {isFirstSpecificArea && <td rowSpan={Object.keys(specificAreas).length}>{serialNumber + auditAreaIndex}</td>}
                                    {isFirstSpecificArea && <td rowSpan={Object.keys(specificAreas).length}>{auditArea}</td>}
                                    {isFirstTaskInSpecificArea && <td rowSpan={tasks.length}>{specificArea}</td>}
                                    <td>{formatDate(task.date)}</td> {/* Include the audit date */}
                                    <td>{task.report_observation}</td>
                                    <td>{task.remarks}</td>
                                    <td>{task.suggestions}</td>
                                    <td>{task.action_taken}</td>
                                    <td>
                                        <select 
                                            value={task.progress} 
                                            onChange={(e) => handleProgressUpdate(task.task_id_specific, e.target.value)}
                                            style={{ backgroundColor: task.progress === 'Completed' ? 'lightgreen' : 'lightblue' }}
                                        >
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                </tr>
                            );
                        });
                    })}
                </>
            );
        });
    };

    const handleProgressUpdate = async (taskId, newProgress) => {
        const confirmUpdate = window.confirm(`Are you sure you want to update the progress to ${newProgress}?`);
        if (!confirmUpdate) {
            return;
        }
        try {
            const response = await fetch(`${api}/updateTaskProgress?taskId=${taskId}&newProgress=${newProgress}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId, newProgress }),
            });
            if (!response.ok) {
                throw new Error('Failed to update task progress');
            }
            // Assuming the backend returns the updated task
            const updatedTask = await response.json();
            setTasks(tasks.map(task => task.task_id_specific === taskId ? updatedTask : task));
        } catch (error) {
            console.error('Error updating task progress:', error);
        }
    };

    return (
        <div style={{ paddingTop: '90px', overflow: 'auto', marginLeft:'10px', marginRight:'10px' }}>
        <h2>Tasks for {formatDate(startDate)} to {formatDate(endDate)}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>Number of Tasks: {TasksCount}</div>
            <div>Completed Tasks: {completedTasksCount}</div>
            <div>Pending Tasks: {pendingTasksCount}</div>
        </div>
            <table className="audit-table">
                <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Audit Date</th> {/* Include the audit date in the table header */}
                        <th>Audit Area</th>
                        <th>Specific Area</th>
                        <th>Report Observation</th>
                        <th>Remarks</th>
                        <th>Specific Task ID</th>
                        <th>action Taken</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                {tasks.map((task, index) => (
                    <tr key={task.task_id_specific}>
                            <td>{index + 1}</td>
                            <td>{formatDate(task.date)}</td>
                            <td>{task.task_id}</td>
                            <td>{task.audit_area}</td>
                            <td>{task.specific_area}</td>
                            <td><div dangerouslySetInnerHTML={{ __html: task.report_observation }} /></td>
                            <td>{task.remarks}</td>
                            <td>{task.task_id_specific}</td>
                            <td>{task.action_taken}</td>
                            <td>
                                <select 
                                    value={task.progress} 
                                    onChange={(e) => handleProgressUpdate(task.task_id_specific, e.target.value)}
                                    style={{ backgroundColor: task.progress === 'Completed' ? 'lightgreen' : 'lightblue' }}
                                >
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <BlobProvider document={<TasksPDFDocument tasks={tasks} startDate={startDate} endDate={endDate} TasksCount={TasksCount} completedTasksCount={completedTasksCount} pendingTasksCount={pendingTasksCount} />}>
                
        {({ blob, url, loading, error }) => {
          setBlob(blob);
          return ( */}
            <div>
            {/* <button onClick={handleDownload}>Download PDF</button> */}

            </div>
          {/* );
        }}
      </BlobProvider> */}
        </div>
    );
    
};

export default AssignWork;
