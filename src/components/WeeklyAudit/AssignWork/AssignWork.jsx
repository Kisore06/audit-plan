import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


const AssignWork = () => {
    const { startDate, endDate } = useParams();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`http://localhost:8001/fetchTasks?startDate=${startDate}&endDate=${endDate}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [startDate, endDate]);

    const handleProgressUpdate = async (taskId, newProgress) => {
        try {
            const response = await fetch(`http://localhost:8001/updateTaskProgress?taskId=${taskId}&newProgress=${newProgress}`, {
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
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    

    return (
        <div style={{ paddingTop: '90px' }}>
            <h2>Tasks for {formatDate(startDate)} to {formatDate(endDate)}</h2>
            <table className="audit-table">
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
                            <td>{task.suggestions}</td>
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
        </div>
    );
    
};

export default AssignWork;
