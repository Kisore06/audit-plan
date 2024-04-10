import React, { useState, useEffect } from 'react';
import './Audit.css';
import axios from 'axios';

const AuditForm = () => {
 const [formData, setFormData] = useState({
    area_name: '',
    audit_date: '',
    auditor_name: '',
    auditor_phone: '',
    questions: [
      {
        question: 'Are the rooms/ restrooms are clean and free from dust?',
        remark: '',
        comment: ''
      },
      {
        question: 'Any damages observed in the furniture?',
        remark: '',
        comment: ''
      },
      {
        question: 'Are the doors and handles are in good conditions?',
        remark: '',
        comment: ''
      },
      {
        question: 'Civil complaints?',
        remark: '',
        comment: ''
      },
      {
        question: 'Carpentry complaints?',
        remark: '',
        comment: ''
      },
      {
        question: 'electrical complaints?',
        remark: '',
        comment: ''
      },
      {
        question: 'plumbing complaints?',
        remark: '',
        comment: ''
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
      const response = await axios.get('http://localhost:8001/remote_area_weekly');
      console.log({response});
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

 const handleSubmit =async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8001/submit-audit', formData);
        console.log('Form data submitted successfully:', response.data);
        // Optionally, clear the form or show a success message
    } catch (error) {
        console.error('Error submitting form data:', error);
        // Optionally, show an error message
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
                        {area.map((area) => (
                            <option key={area.s_no} value={area.area_gender}>
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
                        onChange={(e) => setFormData({ ...formData, audit_date: e.target.value })}
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
                                <label className="form-label" htmlFor={`comment${index}`}>Comment:</label>
                                <textarea
                                    id={`comment${index}`}
                                    name="comment"
                                    value={question.comment}
                                    className="form-textarea"
                                    onChange={(e) => handleInputChange(e, index)}
                                />
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
