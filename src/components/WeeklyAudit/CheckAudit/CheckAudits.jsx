import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './CheckAudits.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { green, red } from '@mui/material/colors';
import ImageIcon from '@mui/icons-material/Image';import Modal from '@mui/material/Modal';
import {Carousel} from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import api from "../../../utils/api";
import AppLayout from '../../AppLayout';
import emailjs from '@emailjs/browser';
import { Box, Typography, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
// import nodemailer from 'nodemailer';

function CheckAudits(){
    return <AppLayout rId={1} body={<Body />}/>
}

const Body = () => {
    const { date } = useParams();
    const [taskId, setTaskId] = useState('');
    const [areaNames, setAreaNames] = useState([]);
    const [auditsData, setAuditsData] = useState([]);
    const [processedAuditsData, setProcessedAuditsData] = useState({});
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedReportObservation, setSelectedReportObservation] = useState('');
    const [selectedRemarks, setSelectedRemarks] = useState('');
    const [selectedSuggestions, setSelectedSuggestions] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const formRef = useRef(null);
    // eslint-disable-next-line no-unused-vars
    const [assignedTaskIds, setAssignedTaskIds] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [specificTasksData, setSpecificTasksData] = useState([])


    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if ( userRole !== 'admin') {
            navigate('/');
        }

    }, [navigate]);


    const [formData, setFormData] = useState({
        taskIdSpecific: '',
        actionTaken: '',
        progress: 'inprogress',
    });

    useEffect(() => {
        const fetchAreaNamesAndAudits = async () => {
            try {
                const areaResponse = await fetch(  `${api}/remote_area_weekly`);
                const areaData = await areaResponse.json();
                const uniqueAreaNames = [...new Set(areaData.map(item => item.area))];
                setAreaNames(uniqueAreaNames);

                const specificarea = [...new Set(areaData.map(item => item.area_gender))];
                const fetchPromises = specificarea.map(async (gender) => {
                    const response = await fetch(`${api}/audits/by-date-and-area?date=${date}&areaName=${gender}`);
                    if (!response.ok) {
                        throw new Error(`Error fetching audits for date: ${date} and area: ${gender}`);
                    }
                    return response.json();
                });

                const allAuditsData = await Promise.all(fetchPromises);
                const auditsData = allAuditsData.flat();
                setAuditsData(auditsData);

                const processedData = areaData.reduce((acc, curr) => {
                    const areaName = curr.area;
                    const areaGender = curr.area_gender;
                    if (!acc[areaName]) {
                        acc[areaName] = {};
                    }
                    acc[areaName][areaGender] = [];
                    return acc;
                }, {});

                setProcessedAuditsData(processedData);
            } catch (error) {
                console.error('Error fetching area names and audits:', error);
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

        const fetchSpecificTasksData = async () => {
            try {
              const response = await fetch(`${api}/specific?date=${date}`);
              const data = await response.json();
                setSpecificTasksData(data);
            } catch (error) {
              console.error('Error fetching specific tasks data:', error);
            }
          };
        

        fetchAreaNamesAndAudits();
        fetchTaskId();
        fetchSpecificTasksData();
    }, [date]);

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
        let allGood = true;

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

    //another useEffect for closing the form when i click outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setIsFormVisible(false); 
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const existingAssignment = specificTasksData.find(assignment => 
            assignment.task_id_specific === formData.taskIdSpecific
          );

        const otherTaskForSameArea = specificTasksData.find(assignment => {
            return assignment.specific_area === selectedGender && formatDate(assignment.date) === formatDate(date);
        });
                
        if (existingAssignment) {
            alert('A specific task ID of this value has already been assigned!');
            return;
        }
        if (otherTaskForSameArea) {
        alert("Another task has already been submitted for this area on this date.");
        return; 
        }
    
        const newTaskId = formData.taskIdSpecific;
    
        const progressValue = formData.progress === 'inprogress'? 'In Progress' : 'Completed';
    
        try {
            const response = await fetch(`${api}/submit-audit-form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: date,
                    taskId: taskId,
                    auditArea: selectedArea,
                    specificArea: selectedGender,
                    reportObservation: selectedReportObservation,
                    remarks: selectedRemarks,
                    suggestions: selectedSuggestions,
                    taskIdSpecific: formData.taskIdSpecific,
                    actionTaken: formData.actionTaken,
                    progress: progressValue,
                }),
            });          
    
            if (!response.ok) {
                throw new Error('Failed to submit data');
            }
    
            // Update the assignedTaskIds state to include the new task ID and area_gender
            setAssignedTaskIds([...assignedTaskIds, { taskId: newTaskId, area_gender: selectedGender, date: date }]);
    

            const templateParams ={
                from_name: 'Kishore.R',
                from_email:' Kishore.cb20@bitsathy.ac.in',
                to_name: 'KISHORE R',
                message: `The action taken was: ${formData.actionTaken} and the specific area is: ${selectedGender}.`,
            };
            emailjs.send('service_nil48bf', 'template_bn0iql4', templateParams, 'Id7VjWrFQJNXniBq6')
             .then((result) => {
                    alert('Email successfully sent!');
                }, (error) => {
                    alert('Failed to send email:', error);
                });
                
            setIsFormVisible(false);
            setFormData({
                taskIdSpecific: '',
                actionTaken: '',
                progress: 'inprogress',
            });
            alert("Specific Task ID assigned Successfully...");
            
                        // const recipient = 'dalekishore002@gmail.com'; 
            // const subject = encodeURIComponent('Specific Task ID Assigned'); 
            // const body = encodeURIComponent('New TAsks are assigned for this week. Kindly check the website for updates.'); 

            // const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
        
            // window.open(mailtoLink, '_blank');
            
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to assign Specific Task ID and send email. Please try again.');
        }
    };
    

    //img view
    const handleOpenModal = (audit) => {
        if (!audit) {
            console.log("Audit data is undefined");
            setImageUrls([]); // Set to an empty array or handle the error as needed
            return; // Exit the function early
        }
        const baseUrl = `${api}/`; // Adjust this to match your server's base URL
            const imageUrls = [];
            for (let i = 1; i <= 7; i++) {
                const imageKey = `image_${i}`;
                if (audit[imageKey]) {
                    const correctedPath = audit[imageKey].replace(/\\/g, '/');
                    // Construct the full URL and encode it
                    const encodedUrl = encodeURI(baseUrl + correctedPath);
                    imageUrls.push(encodedUrl);                }
            }
        setImageUrls(imageUrls);
        setOpenModal(true);
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    
    const totalAreasCovered = new Set(auditsData.map(audit => audit.area_name)).size;;

    const totalObservationsFound = auditsData.reduce((count, audit) => {
        let badRemarksCount = 0;
        for (let i = 1; i <= 7; i++) {
            if (audit[`remark_${i}`] === 'bad') {
                badRemarksCount++;
            }
        }
        return count + badRemarksCount;
    }, 0);  
    
    
/////server side approach:

// Example: Selecting specific columns and preparing data for server

const sendDataAndDownloadPDF = async () => {
    const formattedDate = formatDate(date);

    const dataToSend = {
        totalAreasCovered,
        totalObservationsFound,
        date:formattedDate,
        taskId,
        analysisWeek,
        auditsData:Object.entries(processedAuditsData || {}).map(([areaName, areaGenders]) => {
        // Check if areaGenders is defined and is an object before proceeding
        if (areaGenders && typeof areaGenders === 'object') {
            return Object.entries(areaGenders).map(([gender, audits]) => {
                const auditData = auditsData.find(audit => audit.area_name === gender);
                return {
                    SerialNumber: serialNumbers[areaName],
                    AuditArea: areaName,
                    SpecificArea: gender,
                    ReportObservation: auditData ? determineReportObservation(auditData) : 'No data found.',
                    Remarks: auditData ? auditData.remark_1 + ', ' + auditData.remark_2 + ', ' + auditData.remark_3 + ', ' + auditData.remark_4 + ', ' + auditData.remark_5 + ', ' + auditData.remark_6 + ', ' + auditData.remark_7 : '',
                    Suggestions: auditData ? auditData.suggestion || '' : ''
                };
            });
        }
        // If areaGenders is not defined or not an object, return an empty array or handle accordingly
        return [];
    }).flat(), // Use .flat() to flatten the array of arrays into a single array
    };

    try {
        const response = await fetch(`${api}/generate-pdf`, {
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
        link.setAttribute('download', `Report-${analysisWeek}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
};

    return (
        <div style={{paddingBottom:'50px', marginLeft:'10px', marginRight:'10px'}}>
        <div style={{ paddingTop: '90px', overflow: 'auto' }}>
        <div className="testDownload">
        <div style={{ textAlign: "center" }}>
            <h2>Check Audits</h2>
            <h4 >Remote Area Analysis Report - {analysisWeek}</h4>
        </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>Audit Date: {formatDate(date)}</div>
                <div>Task ID: {taskId}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>Total Areas Covered: {totalAreasCovered}</div>
                <div>Total Observations Found: {totalObservationsFound}</div>
            </div>
            </div>
            <table className="audit-table">
                <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Audit Area</th>
                        <th>Specific Area</th>
                        <th>Report Observation</th>
                        <th>Remarks</th>
                        <th>Suggestions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(processedAuditsData).map(([areaName, areaGenders], areaIndex) => {
                        return Object.entries(areaGenders).map(([gender, audits], genderIndex) => {
                            const specific = `${gender}`;
                            const auditData = auditsData.find(audit => audit.area_name === specific);
                            const reportObservation = auditData ? determineReportObservation(auditData) : 'No data found.';
                            const remarksString = auditData ? auditData.remark_1 + ', ' + auditData.remark_2 + ', ' + auditData.remark_3 + ', ' + auditData.remark_4 + ', ' + auditData.remark_5 + ', ' + auditData.remark_6 + ', ' + auditData.remark_7 : '';
                            const isBadRemark = remarksString.split(',').some(remark => remark.trim() === 'bad');
                            const suggestions = auditData ? auditData.suggestion || '' : '';

                            return (
                                <tr key={`${areaName}-${gender}`}>
                                    {genderIndex === 0 && <td rowSpan={Object.keys(areaGenders).length}>{serialNumbers[areaName]}</td>}
                                    {genderIndex === 0 && <td rowSpan={Object.keys(areaGenders).length}>{areaName}</td>}
                                    <td>
                                        <Link style={{textDecoration:'none', color:'black'}} to={`/audit/${gender}/${date}`}>{gender}</Link>
                                    </td>
                                    <td className="report-observation" dangerouslySetInnerHTML={{ __html: reportObservation }}></td>
                                    {/* <td><input type="text" value={remarksString} onChange={(e) => handleCellChange(e, areaName, gender, 'remarks')} /></td> */}
                                    <td>{remarksString}</td>
                                    <td>{suggestions}</td>
                                    <td>
                                    {isBadRemark && ( 
                                        <div>
                                        <IconButton
                                            size="small"
                                            onClick={(event) => {
                                                setSelectedArea(areaName);
                                                setSelectedGender(gender);
                                                setSelectedReportObservation(determineReportObservation(auditData));
                                                setSelectedRemarks(remarksString);
                                                setSelectedSuggestions(suggestions);
                                                setIsFormVisible(true);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                handleOpenModal(auditData);
                                                setOpenModal(true);
                                            }}
                                        >
                                            <ImageIcon />
                                        </IconButton>

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
                                        </div>
                                    )}

                                    </td>
                                </tr>
                            );
                        });
                    })}
                </tbody>
            </table>
            {isFormVisible && (
                <Box ref={formRef} className="form-container-task">
                    <form onSubmit={handleSubmit} className="form-content-task">
                        <Typography variant="h6" className="form-title-task">Assign Specific Task ID</Typography>
                        <TextField
                            label="Task ID Specific"
                            name="taskIdSpecific"
                            value={formData.taskIdSpecific}
                            onChange={(e) => setFormData({ ...formData, taskIdSpecific: e.target.value })}
                            className="form-field-task"
                        />
                        <TextField
                            label="Action Taken"
                            name="actionTaken"
                            value={formData.actionTaken}
                            onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                            className="form-field-task"
                        />
                        <FormControl component="fieldset" className="form-field-task">
                            <FormLabel component="legend">Progress</FormLabel>
                            <RadioGroup
                                row
                                aria-label="progress"
                                name="row-radio-buttons-group"
                                value={formData.progress}
                                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                            >
                                <FormControlLabel value="inprogress" control={<Radio color="primary" sx={{ color: red[500] }} />} label="In Progress" />
                                <FormControlLabel value="completed" control={<Radio color="primary" sx={{ color: green[500] }} />} label="Completed" />
                            </RadioGroup>
                        </FormControl>
                        <Button variant="contained" color="primary" type="submit" className="form-submit-task">
                            Submit
                        </Button>
                    </form>
                </Box>

            )}
        </div>
            <button className="action-button" onClick={sendDataAndDownloadPDF}>Download PDF</button>
        </div>
    );
    
    
};

export default CheckAudits;