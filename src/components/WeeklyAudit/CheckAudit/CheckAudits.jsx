import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './CheckAudits.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { green, red } from '@mui/material/colors';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ImageIcon from '@mui/icons-material/Image';import Modal from '@mui/material/Modal';
import {Carousel} from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";


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
    const [assignedTaskIds, setAssignedTaskIds] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [openModal, setOpenModal] = useState(false);



    const [formData, setFormData] = useState({
        taskIdSpecific: '',
        actionTaken: '',
        progress: 'inprogress',
    });

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

        const progressValue = formData.progress === 'inprogress' ? 'In Progress' : 'Completed';

        try {
            const response = await fetch('http://localhost:8001/submit-audit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date:date,
                    taskId:taskId,
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

            setAssignedTaskIds([...assignedTaskIds, newTaskId]);

            setIsFormVisible(false);
            setFormData({
                taskIdSpecific: '',
                actionTaken: '',
                progress: 'inprogress',
            });
            alert("specific Task ID assigned Succesfully!...")
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    //img view
    const handleOpenModal = (audit) => {
        if (!audit) {
            console.log("Audit data is undefined");
            setImageUrls([]); // Set to an empty array or handle the error as needed
            return; // Exit the function early
        }
        const baseUrl = 'http://localhost:8001/'; // Adjust this to match your server's base URL
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
 

    return (
        <div style={{ paddingTop: '90px', overflow: 'auto' }}>
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
    );
    
    
};

export default CheckAudits;
