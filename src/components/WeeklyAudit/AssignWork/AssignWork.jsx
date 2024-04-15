import React, { useState } from 'react';
import './AssignWork.css'; // Make sure to import the CSS file

const AssignWork = () => {
    const [tasks, setTasks] = useState([
        { serialNumber: 1, taskId: '', auditArea: '', reportObservation: '', actionTaken: '', statusRemarks: '' },
        // Add more initial rows as needed
    ]);

    const [newTask, setNewTask] = useState({ taskId: '', auditArea: '', reportObservation: '', actionTaken: '', statusRemarks: '' });

    const handleCellChange = (e, rowIndex, columnId) => {
        const newTasks = [...tasks];
        newTasks[rowIndex][columnId] = e.target.value;
        setTasks(newTasks);
    };

    const handleNewTaskChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    const addNewTask = () => {
        const newTaskCopy = { ...newTask, serialNumber: tasks.length + 1 };
        setTasks([...tasks, newTaskCopy]);
        setNewTask({ taskId: '', auditArea: '', reportObservation: '', actionTaken: '', statusRemarks: '' });
    };

    return (
        <div style={{ paddingTop: '90px' }}>
        <h2>Assign Work</h2>
            <table className="assign-work-table">
                <thead>
                    <tr>
                        <th>Serial No.</th>
                        <th>Task ID</th>
                        <th>Audit Area</th>
                        <th>Report Observation</th>
                        <th>Action Taken</th>
                        <th>Status/Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={index}>
                            <td>{task.serialNumber}</td>
                            <td><input type="text" name="taskId" value={task.taskId} onChange={(e) => handleCellChange(e, index, 'taskId')} /></td>
                            <td><input type="text" name="auditArea" value={task.auditArea} onChange={(e) => handleCellChange(e, index, 'auditArea')} /></td>
                            <td><input type="text" name="reportObservation" value={task.reportObservation} onChange={(e) => handleCellChange(e, index, 'reportObservation')} /></td>
                            <td><input type="text" name="actionTaken" value={task.actionTaken} onChange={(e) => handleCellChange(e, index, 'actionTaken')} /></td>
                            <td><input type="text" name="statusRemarks" value={task.statusRemarks} onChange={(e) => handleCellChange(e, index, 'statusRemarks')} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form className="assign-work-form" onSubmit={(e) => { e.preventDefault(); addNewTask(); }}>
                <input type="text" name="taskId" placeholder="Task ID" value={newTask.taskId} onChange={handleNewTaskChange} required />
                <input type="text" name="auditArea" placeholder="Audit Area" value={newTask.auditArea} onChange={handleNewTaskChange} required />
                <input type="text" name="reportObservation" placeholder="Report Observation" value={newTask.reportObservation} onChange={handleNewTaskChange} required />
                <input type="text" name="actionTaken" placeholder="Action Taken" value={newTask.actionTaken} onChange={handleNewTaskChange} required />
                <input type="text" name="statusRemarks" placeholder="Status/Remarks" value={newTask.statusRemarks} onChange={handleNewTaskChange} required />
                <button className="assign-work-button" type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default AssignWork;
