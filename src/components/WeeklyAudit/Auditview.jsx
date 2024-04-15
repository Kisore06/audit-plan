import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Auditview.css';

const AuditView = () => {
    const { area, date } = useParams();
    console.log('Area:', area);
    console.log('Date:', date);
    const [auditData, setAuditData] = useState({});

    useEffect(() => {
        const fetchAuditData = async () => {
            if (!area || !date) {
                console.error('Area name or date is missing');
                return; 
            }
            try {
                const response = await axios.get(`http://localhost:8001/audit?areaName=${encodeURIComponent(area)}&auditDate=${encodeURIComponent(date)}`);
                console.log(response.data);
                setAuditData(response.data);
            } catch (error) {
                console.error('Error fetching audit data:', error);
            }
        };

        if (area && date) {
            fetchAuditData();
        }
    }, [area, date]);

    return (
        <div style={{ paddingTop: '90px' }}>
            <h2>Audit Details</h2>
            <h2>Remote Area Weekly</h2>
            {auditData.length > 0 ? (
                auditData.map((audit, index) => (
                    <div key={index}>
                        <div className="audit-details">
                        <div className="audit-details-left">
                            <div className="audit-details-info">
                                <h3>Area Name: </h3>
                                <p>{audit.area_name}</p>
                            </div>
                            <div className="audit-details-info">
                                <h3>Audit Date: </h3>
                                <p>{audit.audit_date}</p>
                            </div>
                        </div>
                        <div className="audit-details-right">
                            <div className="audit-details-info">
                                <h3>Auditor Name: </h3>
                                <p>{audit.auditor_name}</p>
                            </div>
                            <div className="audit-details-info">
                                <h3>Auditor Phone: </h3>
                                <p>{audit.auditor_phone}</p>
                            </div>
                        </div>
                        </div>

                        <table className="audit-table">
                        <thead>
                            <tr>
                                <th>Serial No.</th>
                                <th>Question</th>
                                <th>Remarks</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(7)].map((_, index) => {
                                const questionField = `question_${index + 1}`;
                                const remarkField = `remark_${index + 1}`;
                                const commentField = `comment_${index + 1}`;
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{audit[questionField]}</td>
                                        <td>{audit[remarkField]}</td>
                                        <td>{audit[commentField]}</td>
                                    </tr>
                                );
                            })}
                            <tr>
                                <td colSpan="4">Suggestion: {audit.suggestion}</td>
                            </tr>
                        </tbody>
                        </table>

                    </div>
                ))
            ) : (
                <p>No audit data found for the selected area and date.</p>
            )}
        </div>
    );
};

export default AuditView;
