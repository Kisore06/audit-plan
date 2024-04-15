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
    console.log(req.body)
    const { username, password, roleId } = req.body;

    try {
        // Check if the username already exists
        const checkQuery = 'SELECT * FROM users WHERE username = ?';
        db.query(checkQuery, [username], async (error, results) => {
            if (error) {
                console.error('Database error:', error);
                res.status(500).send({ message: 'Database error', error: error.message });
            } else if (results.length > 0) {
                res.status(400).send({ message: 'User already exists' });
            } else {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
                // Insert the new user into the database
                const insertQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
                db.query(insertQuery, [username, hashedPassword, roleId], (error) => {
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
        res.status(500).send({ message: 'Internal server error' });
 }
});

//roles
app.get('/roles', (req, res) => {
    console.log('fetching user_roles')
    const query = 'SELECT * FROM user_role'
    db.query(query,(error,results)=>{
        if (error) {
            console.error('problem in users...')
            res.status(500).send('problem in users...');
        }else {
            console.log('Fetched user roles');
            res.send(results);
        }  
    });
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

// Assign task to a specific date
app.post('/assignTask', (req, res) => {
    const { date, taskId } = req.body;

    if (!date || !taskId) {
        return res.status(400).send({ message: 'Date and taskId must be provided.' });
    }

    // Check if a taskId already exists for the given date
    const checkQuery = 'SELECT * FROM audit_tasks WHERE date = ?';
    db.query(checkQuery, [date], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).send({ message: 'Database error', error: error.message });
        } else if (results.length > 0) {
            // A taskId already exists for this date
            res.status(409).send({ message: 'A taskId is already assigned for this date.' });
        } else {
            // No taskId exists for this date, so insert the new task assignment
            const insertQuery = 'INSERT INTO audit_tasks (date, task_id) VALUES (?, ?)';
            db.query(insertQuery, [date, taskId], (error, results) => {
                if (error) {
                    console.error('Error inserting task assignment:', error);
                    res.status(500).send({ message: 'Error inserting task assignment', error: error.message });
                } else {
                    res.send({ message: 'Task assigned successfully' });
                }
            });
        }
    });
});

// Fetch taskId by date
app.get('/getTaskIdByDate', (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).send({ message: 'Date must be provided.' });
    }

    const query = 'SELECT task_id FROM audit_tasks WHERE date = ?';
    const values = [date];

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).send({ message: 'Database error', error: error.message });
        } else if (results.length === 0) {
            // No taskId found for the given date
            res.status(404).send({ message: 'No taskId found for this date.' });
        } else {
            // Return the taskId
            res.send({ taskId: results[0].task_id });
        }
    });
});


// audit-form
app.get('/audit', (req, res) => {
    console.log('Processing audit request...');
    const { areaName, auditDate } = req.query;

    if (!areaName || !auditDate) {
        return res.status(400).send('Both areaName and auditDate must be provided.');
    }

    let query = 'SELECT * FROM audits WHERE area_name = ? AND audit_date = ?';
    let queryParams = [areaName, auditDate];

    db.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('Error processing audit request:', error);
            return res.status(500).send('An error occurred while processing your request.');
        }

        console.log('Audit data retrieved successfully.');
        res.send(results);
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

// audits
app.get('/audits', (req, res) => {
    console.log('inside audits table...')
 const query= 'SELECT * FROM audits'
 db.query(query, (error, results) => {
    if (error) {
        console.error('audits table code la prblm...')
        res.status(500).send('audits table code la prblm...');
    }else {
        console.log('Fetched audits table');
        res.send(results);
    }
 });
});

// Fetch audits by date and area name
app.get('/audits/by-date-and-area', (req, res) => {
    console.log('Fetching audits by date and area...');

    const { date, areaName } = req.query;

    if (!date || !areaName) {
        return res.status(400).send('Date and area name must be provided.');
    }

    // Assuming area_name is the column name in your audits table that stores the area name
    const query = 'SELECT * FROM audits WHERE audit_date = ? AND area_name = ?';
    const queryParams = [date, areaName];

    db.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('Error fetching audits by date and area:', error);
            res.status(500).send('Error fetching audits by date and area.');
        } else {
            console.log('Fetched audits by date and area successfully.');
            res.send(results);
        }
    });
});



// Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
