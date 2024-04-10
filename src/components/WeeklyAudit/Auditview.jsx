import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AuditView = () => {
    const { area, date } = useParams();
    const [auditData, setAuditData] = useState({});

    useEffect(() => {
        const fetchAuditData = async () => {
            try {
                const response = await axios.get(`http://localhost:8001/audits?areaName=${area}&auditDate=${date}`);
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
            {auditData.length > 0 ? (
                auditData.map((audit, index) => (
                    <div key={index}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <h3>Auditor Name: {audit.auditor_name}</h3>
                                <h3>Audit Date: {audit.audit_date}</h3>
                            </div>
                            <div>
                                <h3>Area Name: {audit.area_name}</h3>
                                <h3>Auditor Phone: {audit.auditor_phone}</h3>
                            </div>
                        </div>

                        <table>
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
