const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'audit-plan'
   });
   
   db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
   });

// Middleware to parse JSON bodies
app.use(express.json());

// A simple route to test the connection
app.get('/', (req, res) => {
 res.send('Hello World!');
});

// remote-area-weekly
app.get('/remote_area_weekly', (req, res) => {
    console.log('vanthuten...')
 const query= 'SELECT * FROM remote_area_weekly'
 db.query(query, (error, results) => {
    if (error) {
        console.error('code la prblm...')
        res.status(500).send('code la prblm...');
    }else {
        console.log('vanthuten nu sollu...');
        res.send(results);
    }
 });
});

// audit-form
// audit-form
app.get('/audits', (req, res) => {
    console.log('audit vanthuten...')
    const { areaName, auditDate } = req.query;

    let query = 'SELECT * FROM audits';
    let queryParams = [];

    if (areaName) {
        query += ' WHERE area_name = ?';
        queryParams.push(areaName);
    }

    if (auditDate) {
        if (queryParams.length > 0) {
            query += ' AND audit_date = ?';
        } else {
            query += ' WHERE audit_date = ?';
        }
        queryParams.push(auditDate);
    }

    db.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('audit code la prblm...')
            res.status(500).send('audit code la prblm...');
        } else {
            console.log('audit varen nu sollu...');
            res.send(results);
        }
    });
});


// submit audit form data
app.post('/submit-audit', (req, res) => {
    const formData = req.body;
    const questions = formData.questions;
    const questionFields = questions.map((_, index) => `question_${index + 1}, remark_${index + 1}, comment_${index + 1}`).join(', ');
    const placeholders = questions.map((_, index) => '?, ?, ?').join(', ');
    const values = [];

    values.push(formData.area_name, formData.audit_date, formData.auditor_name, formData.auditor_phone);

    questions.forEach(q => {
        values.push(q.question, q.remark, q.comment);
    });

    values.push(formData.suggestion);

    const query = `INSERT INTO audits (area_name, audit_date, auditor_name, auditor_phone, ${questionFields}, suggestion) VALUES (?, ?, ?, ?, ${placeholders}, ?)`;

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Error inserting audit data:', error);
            res.status(500).send({ message: 'Error inserting audit data', error: error.message });
        } else {
            console.log('Audit data inserted successfully');
            res.send({ message: 'Audit data submitted successfully' });
        }
    });
});




// Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
