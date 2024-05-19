import React, { useState, useEffect } from 'react';
import './Audit.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import api from "../../utils/api"


const AuditForm = () => {
    const navigate = useNavigate();
    useEffect(() => {
    const userRole = localStorage.getItem('role');
        if ( userRole !== 'user' && userRole!== 'admin') {
                navigate('/');
        }

        // const loginTime = localStorage.getItem('loginTime');
        // const sessionTimeout = 6 * 60 * 60 * 1000; 
        // if (!loginTime || Date.now() - loginTime > sessionTimeout) {
        //     localStorage.removeItem('role');
        //     localStorage.removeItem('loginTime');
        //     navigate('/');
        // }
    }, [navigate]);

    const fetchLastAuditDate = async () => {
        try {
            const response = await axios.get(`${api}/last-audit-date`);
            if (response.data && response.data.date) {
                const date = new Date(response.data.date);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                const day = String(date.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
    
                setFormData(prevState => ({...prevState, audit_date: formattedDate }));
            }
        } catch (error) {
            console.error('Error fetching last audit date:', error);
        }
    };
    
    

    useEffect(() => {
        fetchLastAuditDate();
    }, []);

    useEffect(() => {
        const username = localStorage.getItem('username'); 
        if (username) {
            fetchUserDetails(username);
        }
    }, []);

    const fetchUserDetails = async (username) => {
        try {
            const response = await axios.get(`${api}/users/${username}`);
            if (response.data) {
                const { firstName, lastName, phoneNumber } = response.data;
                setFormData(prevState => ({
                   ...prevState,
                    auditor_name: `${firstName} ${lastName}`,
                    auditor_phone: phoneNumber,
                }));
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    

 const [formData, setFormData] = useState({
    area_name: '',
    audit_date: '',
    auditor_name: '',
    auditor_phone: '',
    questions: [
      {
        question: 'Are the rooms/ restrooms are clean and free from dust?',
        remark: '',
        comment: '', 
        image: null
      },
      {
        question: 'Any damages observed in the furniture?',
        remark: '',
        comment: '',
        image: null
      },
      {
        question: 'Are the doors and handles are in good conditions?',
        remark: '',
        comment: '',
        image: null
      },
      {
        question: 'Civil complaints?',
        remark: '',
        comment: '',
        image: null
      },
      {
        question: 'Carpentry complaints?',
        remark: '',
        comment: '',
        image: null
      },
      {
        question: 'Electrical complaints?',
        remark: '',
        comment: '',
        image: null
      },
      {
        question: 'Plumbing complaints?',
        remark: '',
        comment: '',
        image: null
      },
    ],
    suggestion:''
 });

 const[area, setArea] = useState([]);

 useEffect(() => {
    fetchAreaName();
 }, []);

 const fetchAreaName = async () => {
    try {
      const response = await axios.get(`${api}/remote_area_weekly`);
      setArea(response.data);
    } catch (error) {
      console.error('Error fetching area name:', error);
    }
 };

 const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][name] = value;
    setFormData({ ...formData, questions: updatedQuestions });
 };

 const handleRemarkChange = (e, index) => {
    const { value } = e.target;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index].remark = value;
    setFormData({ ...formData, questions: updatedQuestions });
 };
 const handleSuggestionChange = (e) => {
    setFormData(prevState => ({ ...prevState, suggestion: e.target.value }));
};

const handleFileChange = (e, index) => {
    const file = e.target.files[0]; 
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index].image = file; 
    setFormData({ ...formData, questions: updatedQuestions });
};


const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();

    formDataToSubmit.append('area_name', formData.area_name);
    formDataToSubmit.append('audit_date', formData.audit_date);
    formDataToSubmit.append('auditor_name', formData.auditor_name);
    formDataToSubmit.append('auditor_phone', formData.auditor_phone);
    formDataToSubmit.append('suggestion', formData.suggestion);

    formDataToSubmit.append('questions', JSON.stringify(formData.questions));

    formData.questions.forEach((question, index) => {
        if (question.image) {
            formDataToSubmit.append(`image${index + 1}`, question.image);
        }
    });

    try {
        const response = await fetch(`${api}/submit-audit`, {
            method: 'POST',
            body: formDataToSubmit,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Form data submitted successfully:', data);
        Swal.fire({ // Show SweetAlert popup on successful submission
            title: "Submitted",
            icon: "success"
          });
        window.location.reload();
    } catch (error) {
        console.error('Error submitting form data:', error);
    }
};


 return (
    <div style={{ paddingTop: '90px' }}>
    <div className="form-container">
            <h2 className="he2">Remote Area - Weekly Audit Plan</h2>
            <form className="audit-form" onSubmit={handleSubmit}>
                <div className="form-header">
                    <label className="form-label" htmlFor="areaName">Area Name:</label>
                    <select
                        id="area_name"
                        name="area_name"
                        value={formData.area_name}
                        onChange={(e) => setFormData({ ...formData, area_name: e.target.value })}
                        required
                        className="form-select"
                    >
                        <option value="">Select Area</option>
                        {area.map((area, index) => (
                            <option key={index} value={area.area_gender}>
                                {area.area_gender}
                            </option>
                        ))}
                    </select>
                    <br />

                    <label className="form-label" htmlFor="auditDate">Date:</label>
                    <input
                        type="date"
                        id="audit_date"
                        name="audit_date"
                        value={formData.audit_date}
                        readOnly
                        // onChange={(e) => setFormData({...formData, audit_date: e.target.value })}
                        required
                        className="form-select"
                    />

                    <br />
                </div>
                <div className="auditor-info">
                    <label className="form-label" htmlFor="auditorName">Auditor Name:</label>
                    <input
                        type="text"
                        id="auditor_name"
                        name="auditor_name"
                        value={formData.auditor_name}
                        onChange={(e) => setFormData({ ...formData, auditor_name: e.target.value })}
                        required
                        className="form-input"
                    />
                    <br />

                    <label className="form-label" htmlFor="auditorPhone">Phone Number:</label>
                    <input
                        type="tel"
                        id="auditor_phone"
                        name="auditor_phone"
                        value={formData.auditor_phone}
                        onChange={(e) => setFormData({ ...formData, auditor_phone: e.target.value })}
                        required
                        className="form-input"
                    />
                    <br />
                </div>

                {formData.questions.map((question, index) => (
                    <div className="question-container" key={index}>
                        <label className="form-label" htmlFor={`question${index}`}>{index + 1}. {question.question}</label>
                        <select
                            id={`question${index}`}
                            name="remark"
                            value={question.remark}
                            className="form-select"
                            onChange={(e) => handleRemarkChange(e, index)}
                        >
                            <option value="">Select...</option>
                            <option value="good">Good Condition</option>
                            <option value="bad">Bad Condition</option>
                        </select>
                        <br />

                        {question.remark === 'bad' && (
                            <div>
                            <div>
                                <label className="form-label" htmlFor={`comment${index}`}>Comment:</label>
                                <textarea
                                    id={`comment${index}`}
                                    name="comment"
                                    value={question.comment}
                                    className="form-textarea"
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                            </div>
                            <div>
                            <label>
                                Image:
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) => handleFileChange(e, index)}                                   
                                    required 
                                />
                            </label>
                            </div>
                            </div>
                        )}
                    </div>
                ))}

                <label className="form-label" htmlFor="suggestion">Any Suggestion for improvement:</label>
                <textarea
                    id="suggestion"
                    name="suggestion"
                    value={formData.suggestion}
                    onChange={handleSuggestionChange}
                    className="form-textarea"
                />
                <br />
                <input type="submit" className="form-submit" value="Submit" />
            </form>
        </div>
        </div>
 );
};

export default AuditForm;