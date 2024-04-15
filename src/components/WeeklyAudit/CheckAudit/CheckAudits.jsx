import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CheckAudits.css'; 

const CheckAudits = () => {
    const { date } = useParams();
    const [taskId, setTaskId] = useState('');
    const [areaNames, setAreaNames] = useState([]);
    const [auditsData, setAuditsData] = useState([]);
    const [processedAuditsData, setProcessedAuditsData] = useState({});

    useEffect(() => {
        const fetchAreaNamesAndAudits = async () => {
            try {
                const areaResponse = await fetch('http://localhost:8001/remote_area_weekly');
                const areaData = await areaResponse.json();
                const uniqueAreaNames = [...new Set(areaData.map(item => item.area))];
                setAreaNames(uniqueAreaNames);
                
                const specificarea = [...new Set(areaData.map(item => item.area_gender))];
                const fetchPromises = specificarea.map(async (gender) => {
                    const response = await fetch(`http://localhost:8001/audits/by-date-and-area?date=${date}&areaName=${gender}`);
                    if (!response.ok) {
                        throw new Error(`Error fetching audits for date: ${date} and area: ${gender}`);
                    }
                    return response.json();
                });
    
                // Wait for all fetch promises to resolve
                const allAuditsData = await Promise.all(fetchPromises);
    
                // Flatten the array of arrays into a single array
                const auditsData = allAuditsData.flat();
                setAuditsData(auditsData);
                console.log("auditsData:",auditsData);

                // Process the data to group areas by their area_gender
                // Assuming areaData is the data fetched from 'http://localhost:8001/remote_area_weekly'
                const processedData = areaData.reduce((acc, curr) => {
                    const areaName = curr.area;
                    const areaGender = curr.area_gender;
                    if (!acc[areaName]) {
                        acc[areaName] = {};
                    }
                    acc[areaName][areaGender] = []; // Initialize an array for each area and gender
                    return acc;
                }, {});

                // Now, processedData is structured as { areaName: { areaGender: [] } }

                setProcessedAuditsData(processedData);
            } catch (error) {
                console.error('Error fetching area names and audits:', error);
            }
        };

        const fetchTaskId = async () => {
            try {
                const response = await fetch(`http://localhost:8001/getTaskIdByDate?date=${date}`);
                if (!response.ok) {
                    throw new Error(`Error fetching taskId for date: ${date}`);
                }
                const data = await response.json();
                setTaskId(data.taskId); 
            } catch (error) {
                console.error('Error fetching taskId:', error);
            }
        };

        fetchAreaNamesAndAudits();
        fetchTaskId();
    }, [date]);

    const handleCellChange = (e, areaName, areaGender, field) => {
        const updatedAuditsData = auditsData.map(audit => {
            if (audit.area_name === areaName && audit.area_gender === areaGender) {
                return { ...audit, [field]: e.target.value };
            }
            return audit;
        });
        setAuditsData(updatedAuditsData);
    };

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Generate a unique serial number for each area
    const generateSerialNumbers = () => {
        let serialNumber = 1;
        const serialNumbers = {};
        areaNames.forEach(areaName => {
            serialNumbers[areaName] = serialNumber++;
        });
        return serialNumbers;
    };

    const serialNumbers = generateSerialNumbers();

    const determineReportObservation = (audit) => {
        let comments = [];
        let allGood = true; // Assume all remarks are good initially
    
        for (let i = 1; i <= 7; i++) {
            const remark = audit[`remark_${i}`];
            const comment = audit[`comment_${i}`];
    
            if (remark === 'bad') {
                comments.push(`- ${comment || 'No comment provided.'}`);
                allGood = false; 
            }
        }
    
        if (allGood) {
            return 'No discrepancies found.';
        }
    
        if (comments.length > 0) {
            return comments.join('<br />');
        }
    
        return 'No data found.';
    };
    
   

    return (
        <div style={{ paddingTop: '90px' }}>
            <h2>Check Audits</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>Audit Date: {formatDate(date)}</div>
                <div>Task ID: {taskId}</div>
            </div>
            <table className="audit-table">
                <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Audit Area</th>
                        <th>Specific Area</th>
                        <th>Report Observation</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(processedAuditsData).map(([areaName, areaGenders], areaIndex) => {
                        return Object.entries(areaGenders).map(([gender, audits], genderIndex) => {
                            const specific = `${gender}`;
                            const auditData = auditsData.find(audit => audit.area_name === specific);
                            console.log("audit data:", auditData);
                            const reportObservation = auditData ? determineReportObservation(auditData) : 'No data found.';
                            console.log("report:", reportObservation);

                            // Collect remarks into a single string
                            const remarksString = auditData ? auditData.remark_1 + ', ' + auditData.remark_2 + ', ' + auditData.remark_3 + ', ' + auditData.remark_4 + ', ' + auditData.remark_5 + ', ' + auditData.remark_6 + ', ' + auditData.remark_7 : '';

                            return (
                                <tr key={`${areaName}-${gender}`}>
                                    {genderIndex === 0 && <td rowSpan={Object.keys(areaGenders).length}>{serialNumbers[areaName]}</td>}
                                    {genderIndex === 0 && <td rowSpan={Object.keys(areaGenders).length}>{areaName}</td>}
                                    <td>{gender}</td>
                                    <td className="report-observation" dangerouslySetInnerHTML={{ __html: reportObservation }}></td>
                                    <td><input type="text" value={remarksString} onChange={(e) => handleCellChange(e, areaName, gender, 'remarks')} /></td>
                                </tr>
                            );
                        });
                    })}
                </tbody>

            </table>
        </div>
    );
};

export default CheckAudits;
