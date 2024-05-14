import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Auditview.css';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Modal from '@mui/material/Modal';
import {Carousel} from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import api from "../../utils/api"


const AuditView = () => {
    const { area, date } = useParams();
    const [auditData, setAuditData] = useState({});
    const [imageUrls, setImageUrls] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if ( userRole !== 'admin') {
            navigate('/');
        }

    }, [navigate]);

    useEffect(() => {
        const fetchAuditData = async () => {
            if (!area || !date) {
                console.error('Area name or date is missing');
                return; 
            }
            try {
                const response = await axios.get(`${api}/audit?areaName=${encodeURIComponent(area)}&auditDate=${encodeURIComponent(date)}`);
                setAuditData(response.data);
            } catch (error) {
                console.error('Error fetching audit data:', error);
            }
        };

        if (area && date) {
            fetchAuditData();
        }
    }, [area, date]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    //img view
    const handleOpenModal = (audit, questionIndex) => {
        if (!audit) {
            console.log("Audit data is undefined");
            setImageUrls([]); 
            return; 
        }
        const baseUrl = `${api}/`; 
        const imageKey = `image_${questionIndex}`;
        if (audit[imageKey]) {
            const correctedPath = audit[imageKey].replace(/\\/g, '/');
            // Construct the full URL and encode it
            const encodedUrl = encodeURI(baseUrl + correctedPath);
            setImageUrls([encodedUrl]); // Set only the relevant image URL
        } else {
            setImageUrls([]); // No image for this question
        }
        setOpenModal(true);
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
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

    return (
        <div style={{ paddingTop: '90px', overflow:'auto' }}>
            <div style={{ textAlign: "center" }}>
                <h2>Weekly Audit Details</h2>
                <h4 >Remote Area Analysis Report - {analysisWeek}</h4>
            </div>
            {auditData.length > 0 ? (
                auditData.map((audit, index) => (
                    <div key={index}>
                        <div className="audit-details">
                        <div className="audit-details-left">
                            <div className="audit-details-info">
                                <h3 className='h3'>Area Name: </h3>
                                <p>{audit.area_name}</p>
                            </div>
                            <div className="audit-details-info">
                                <h3 className='h3'>Audit Date: </h3>
                                <p>{formatDate(audit.audit_date)}</p>
                            </div>
                        </div>
                        <div className="audit-details-right">
                            <div className="audit-details-info">
                                <h3 className='h3'>Auditor Name: </h3>
                                <p>{audit.auditor_name}</p>
                            </div>
                            <div className="audit-details-info">
                                <h3 className='h3'>Auditor Phone: </h3>
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
                                <th>Image</th>
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
                                        <td>
                                        {audit[remarkField] === "bad" && (
                                            <IconButton
                                            size= "small"
                                            onClick={() => {
                                                handleOpenModal(audit, index + 1);
                                                setOpenModal(true);
                                            }}
                                            >
                                            <VisibilityIcon />
                                            </IconButton>
                                        )}

                                        </td>
                                    </tr>

                                );
                            })}
                            <Modal
                                open={openModal}
                                onClose={handleCloseModal}
                                aria-labelledby="modal-title"
                                aria-describedby="modal-description"
                            >
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
                                <Carousel>
                                
                                    {imageUrls.map((url, index) => (
                                        <img key={index} src={url} alt={`Slide ${index + 1}`} />
                                    ))}
                                </Carousel>

                                </div>
                            </Modal>
                            <tr>
                                <td colSpan="5">Suggestion: {audit.suggestion}</td>
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
