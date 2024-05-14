import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CheckAudits.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { green, red } from '@mui/material/colors';
import ImageIcon from '@mui/icons-material/Image';import Modal from '@mui/material/Modal';
import {Carousel} from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import api from "../../../utils/api";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';

import { Box, Typography, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
// import nodemailer from 'nodemailer';


const CheckAudits = () => {
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
    const [loader, setLoader] = useState(false);


    const downloadPDF = () => {
        const capture = document.querySelector('.testDownload');
        const tableCapture = document.querySelector('.audit-table'); // Assuming .audit-table is the class of your table
        setLoader(true);
    
        // Capture both the div and the table
        Promise.all([
            html2canvas(capture),
            html2canvas(tableCapture)
        ]).then(([divCanvas, tableCanvas]) => {
            const divImgData = divCanvas.toDataURL('image/png');
            const tableImgData = tableCanvas.toDataURL('image/png');
    
            const margin = 10; // Margin in mm on both sides
            const availableWidth = 297 - 2 * margin; // A4 width in mm for landscape minus the margins
            const imgWidth = (divCanvas.width * availableWidth) / divCanvas.width;
            const imgHeight = (divCanvas.height * imgWidth) / divCanvas.width;
            const tableImgWidth = (tableCanvas.width * availableWidth) / tableCanvas.width;
            const tableImgHeight = (tableCanvas.height * tableImgWidth) / tableCanvas.width;
    
            const doc = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape, 'a4' for page format
            const pageHeight = doc.internal.pageSize.getHeight();
            let heightLeft = imgHeight + tableImgHeight; // Total height of both the div and the table
            let position = 0;
    
            // Adjust the position to account for the left margin
            const adjustedPosition = margin;
    
            // Add the div content
            doc.addImage(divImgData, 'PNG', adjustedPosition, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
    
            // Add the table content
            position = heightLeft - tableImgHeight;
            doc.addPage();
            doc.addImage(tableImgData, 'PNG', adjustedPosition, position, tableImgWidth, tableImgHeight);
            heightLeft -= pageHeight;
    
            // Add additional pages if the content exceeds one page
            while (heightLeft >= 0) {
                position = heightLeft - tableImgHeight;
                doc.addPage();
                doc.addImage(tableImgData, 'PNG', adjustedPosition, position, tableImgWidth, tableImgHeight);
                heightLeft -= pageHeight;
            }
    
            setLoader(false);
            doc.save('Check Audit.pdf');
        });
    };
    
    
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

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

    //another useRef for closing the form when i click outside of it
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
    
        const newTaskId = formData.taskIdSpecific;
    
        // Check if the new taskId already exists
        if (assignedTaskIds.includes(newTaskId)) {
            alert('A taskId with this value has already been assigned. Please choose a different taskId.');
            return;
        }
    
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
    
            // Assuming the server responds with the submitted data
            const submittedData = await response.json();
    
            // Prepare the data to be sent in the email
            const emailData = {
                date: submittedData.date,
                taskId: submittedData.taskId,
                auditArea: submittedData.auditArea,
                specificArea: submittedData.specificArea,
                reportObservation: submittedData.reportObservation,
                remarks: submittedData.remarks,
                suggestions: submittedData.suggestions,
                taskIdSpecific: submittedData.taskIdSpecific,
                actionTaken: submittedData.actionTaken,
                progress: submittedData.progress,
            };
    
            // Send the email
            await fetch(`${api}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
            });
    
            // Handle success
            setIsFormVisible(false);
            setFormData({
                taskIdSpecific: '',
                actionTaken: '',
                progress: 'inprogress',
            });
            alert("Specific Task ID assigned successfully and email sent.");
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

    ////
    function exportTableToCSV(data) {
        const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values
        const header = Object.keys(data[0]);
        let csv = [];
        let lastSerialNumber = '';
        let lastAuditArea = '';
    
        // Prepare the CSV header
        csv.push(header.join(','));
    
        data.forEach((row, index) => {
            // Prepare the row data
            const values = header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',');
            let csvLine = '';
    
            // Check if the current row's SerialNumber is the same as the last one
            if (row.SerialNumber !== lastSerialNumber) {
                // If not, add the SerialNumber to the CSV line
                csvLine += row.SerialNumber + ',';
                lastSerialNumber = row.SerialNumber;
            } else {
                // If it's the same, add an empty field for SerialNumber
                csvLine += ',';
            }
    
            // Check if the current row's AuditArea is the same as the last one
            if (row.AuditArea !== lastAuditArea) {
                // If not, add the AuditArea to the CSV line
                csvLine += row.AuditArea + ',';
                lastAuditArea = row.AuditArea;
            } else {
                // If it's the same, add an empty field for AuditArea
                csvLine += ',';
            }
    
            // Add the rest of the row data, excluding the SerialNumber and AuditArea
            const rowData = values.split(',').slice(2).join(',');
            csvLine += rowData;
    
            // Add the CSV line to the CSV array
            csv.push(csvLine);
        });
    
        csv = csv.join('\r\n');
    
        // Create a Blob from the CSV string
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
        // Create a link element
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'audit_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    
    const handleExport = () => {
        // Assuming `processedAuditsData` is your data source
        const dataToExport = Object.entries(processedAuditsData).map(([areaName, areaGenders]) => {
            return Object.entries(areaGenders).map(([gender, audits]) => {
                // Find the auditData for the current gender
                const auditData = auditsData.find(audit => audit.area_name === gender);
    
                // Safely access properties of auditData
                const reportObservation = auditData ? determineReportObservation(auditData) : 'No data found.';
                const remarksString = auditData ? auditData.remark_1 + ', ' + auditData.remark_2 + ', ' + auditData.remark_3 + ', ' + auditData.remark_4 + ', ' + auditData.remark_5 + ', ' + auditData.remark_6 + ', ' + auditData.remark_7 : '';
                const suggestions = auditData ? auditData.suggestion || 'Nil' : 'Nil';
    
                return {
                    SerialNumber: serialNumbers[areaName],
                    AuditArea: areaName,
                    SpecificArea: gender,
                    ReportObservation: reportObservation,
                    Remarks: remarksString,
                    Suggestions: suggestions,
                    // Add any other fields you need
                };
            });
        }).flat(); // Flatten the array to get a single array of objects
    
        exportTableToCSV(dataToExport);

}
   
    /////server side approach:

   // Example: Selecting specific columns and preparing data for server
   const dataToSend = {
    totalAreasCovered,
    totalObservationsFound,
    date,
    taskId,
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
                Suggestions: auditData ? auditData.suggestion || 'Nil' : 'Nil'
            };
        });
    }
    // If areaGenders is not defined or not an object, return an empty array or handle accordingly
    return [];
}).flat(), // Use .flat() to flatten the array of arrays into a single array
};


const sendDataAndDownloadPDF = async () => {
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
        link.setAttribute('download', 'report.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
};

    return (
        <div>
        <div style={{ paddingTop: '90px', overflow: 'auto' }}>
        <div className="testDownload">
        <h2>Check Audits</h2>
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
                            const suggestions = auditData ? auditData.suggestion || 'Nil' : 'Nil';

                            return (
                                <tr key={`${areaName}-${gender}`}>
                                    {genderIndex === 0 && <td rowSpan={Object.keys(areaGenders).length}>{serialNumbers[areaName]}</td>}
                                    {genderIndex === 0 && <td rowSpan={Object.keys(areaGenders).length}>{areaName}</td>}
                                    <td>{gender}</td>
                                    <td className="report-observation" dangerouslySetInnerHTML={{ __html: reportObservation }}></td>
                                    <td><input type="text" value={remarksString} onChange={(e) => handleCellChange(e, areaName, gender, 'remarks')} /></td>
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
        <button
            className="receipt-modal-download-button"
            onClick={downloadPDF}
            disabled={!(loader===false)}
            >
            {loader?(
                <span>Downloading</span>
            ):(
                <span>Download</span>
            )}
        </button>

        <button onClick={handleExport}>Export Data</button>
        <button onClick={sendDataAndDownloadPDF}>Download PDF</button>


        {/* <button onClick={handleDownload}>Download PDF</button>
        <BlobProvider document={<CheckAuditsPDF auditsData={auditsData} date={date} taskId={taskId} />}>
        {({ blob, url, loading, error }) => {
            if (!loading && !error) {
            pdfDownloadRef.current = blob;
            }
            return null; // Render nothing, just use the blob for downloading
        }}
        </BlobProvider> */}
        </div>
    );
    
    
};

export default CheckAudits;