import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CheckAudits.css'; 

const CheckAudits = () => {
    const { date } = useParams();

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
                console.log(auditsData);

                // Process the data to group areas by their area_gender
                const processedData = areaData.reduce((acc, curr) => {
                    const areaName = curr.area;
                    const areaGender = curr.area_gender;
                    if (!acc[areaName]) {
                        acc[areaName] = [];
                    }
                    acc[areaName].push(areaGender);
                    return acc;
                }, {});

                setProcessedAuditsData(processedData);
            } catch (error) {
                console.error('Error fetching area names and audits:', error);
            }
        };

        fetchAreaNamesAndAudits();
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

    // Function to determine the report observation based on remarks
    const determineReportObservation = (remarks) => {
        if (typeof remarks === 'string') {
            if (remarks.includes('good')) {
                return 'No discrepancies found.';
            } else if (remarks.trim() !== '') {
                return remarks; // Return the remarks directly if they are not empty
            } else {
                return 'No data found.';
            }
        } else {
            // Handle cases where remarks are not a string
            // This is just a placeholder. You'll need to adjust this based on how your remarks are structured.
            return 'No data found.';
        }
    };
    

    return (
        <div style={{ paddingTop: '90px' }}>
            <h2>Check Audits</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>Audit Date: {formatDate(date)}</div>
                <div>Task ID: <input type="text" value={auditsData[0]?.taskId || ''} onChange={(e) => handleCellChange(e, '', '', 'taskId')}/></div>
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
                        return areaGenders.map((gender, genderIndex) => {
                            const auditData = auditsData.find(audit => audit.area_name === areaName && audit.area_gender === gender);
                            const reportObservation = determineReportObservation(auditData?.remarks || []);
                            return (
                                <tr key={`${areaName}-${gender}`}>
                                    {genderIndex === 0 && <td rowSpan={areaGenders.length}>{serialNumbers[areaName]}</td>}
                                    {genderIndex === 0 && <td rowSpan={areaGenders.length}>{areaName}</td>}
                                    <td>{gender}</td>
                                    <td>{reportObservation}</td>
                                    <td><input type="text" value={auditData?.remarks.join(', ') || ''} onChange={(e) => handleCellChange(e, areaName, gender, 'remarks')} /></td>
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
