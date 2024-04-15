const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());


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

// Create a connection pool
// const db = mysql.createPool(dbConfig);

// Middleware to parse JSON bodies
app.use(express.json());

// A simple route to test the connection
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Login endpoint with role-based access control
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = 'SELECT users.*, user_role.role as role_name FROM users JOIN user_role ON users.role = user_role.id WHERE username = ?';
        db.query(query, [username], async (error, results) => {
            if (error) {
                console.error('Database error:', error);
                res.status(500).send({ message: 'Database error', error: error.message });
            } else if (results.length === 0) {
                res.status(404).send({ message: 'User not found' });
            } else {
                const user = results[0];
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (passwordMatch) {
                    const token = jwt.sign({ id: user.id, role: user.role_name }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
                    res.send({ message: 'Login successful', token, role: user.role_name });
                } else {
                    res.status(401).send({ message: 'Invalid credentials' });
                }
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Endpoint to add new user
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const checkQuery = 'SELECT * FROM users WHERE username = ?';
        db.query(checkQuery, [username], async (error, results) => {
            if (error) {
                console.error('Database error:', error);
                res.status(500).send({ message: 'Database error', error: error.message });
            } else if (results.length > 0) {
                res.status(400).send({ message: 'User already exists' });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const insertQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
                db.query(insertQuery, [username, hashedPassword, role], (error) => {
                    if (error) {
                        console.error('Database error:', error);
                        res.status(500).send({ message: 'Database error', error: error.message });
                    } else {
                        res.send({ message: 'User registered successfully' });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Fetch audits
app.get('/audits', (req, res) => {
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
            console.error('Error fetching audits:', error);
            res.status(500).send({ message: 'Error fetching audits', error: error.message });
        } else {
            res.send(results);
        }
    });
});

// Submit audit form data
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
            res.send({ message: 'Audit data submitted successfully' });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
