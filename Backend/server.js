const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer = require('multer');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json())
app.use('/uploads/images', express.static('uploads/images'));

app.use('/pdf/pdf', express.static(path.join(__dirname, 'pdf', 'pdf')));



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

// Configure Multer to use the 'uploads' directory and handle multiple files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    }
});

const upload = multer({ storage: storage }).fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 },
    { name: 'image6', maxCount: 1 },
    { name: 'image7', maxCount: 1 },
]);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Internal server error', error: err.message });
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
    const { username, password, roleId, firstName, lastName, phoneNumber, staffId } = req.body;

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
                const insertQuery = 'INSERT INTO users (username, password, role, firstName, lastName, phoneNumber, staffId) VALUES (?, ?, ?, ?, ?, ?, ?)';
                db.query(insertQuery, [username, hashedPassword, roleId, firstName, lastName, phoneNumber, staffId ], (error) => {
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

// Middleware to verify the JWT token and add the user's ID to the request object
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
};

// Endpoint to fetch the details of the currently logged-in user
app.get('/users/me', verifyToken, (req, res) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [req.userId], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).send({ message: 'Database error', error: error.message });
        } else if (results.length === 0) {
            res.status(404).send({ message: 'User not found' });
        } else {
            const user = results[0];
            res.send({
                id: user.id,
                username: user.username,
                role: user.role, // Assuming 'role' is the column name for the user's role
                // Add any other user details you want to return
            });
        }
    });
});


//users
app.get('/users', (req, res) => {
    console.log('fetching user details')
    const query = 'SELECT * FROM users'
    db.query(query,(error,results)=>{
        if (error) {
            console.error('problem in user details...')
            res.status(500).send('problem in user details...');
        }else {
            console.log('Fetched user details');
            res.send(results);
        }  
    });
});

//get users by id
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username} = req.body;
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [username, id], (err, result) => {
        if (err) {
            console.error('problem in username fetch...', err);
            res.status(500).send('Error fetching users');
        } else {
            res.send(result);
        }
    });
});

//get users by username stored in localstorage
app.get('/users/:username', (req, res) => {
    console.log('Fetching user details');
    const { username } = req.params;
    const query = 'SELECT firstName, lastName, phoneNumber FROM users WHERE username =?';

    db.query(query, [username], (error, results) => {
        if (error) {
            console.error('Problem fetching user details:', error);
            res.status(500).send('Problem fetching user details');
        } else {
            console.log('Fetched user details successfully');
            if (results.length > 0) {
                res.send(results[0]);
            } else {
                res.status(404).send({ message: 'User not found' });
            }
        }
    });
});

// Edit users
app.put('/usersedit/:id', (req, res) => {
    const { id } = req.params;
    const { username, firstName, lastName, phoneNumber, staffId } = req.body;
    // Construct the query string to update multiple fields
    const query = `
        UPDATE users 
        SET username =?, firstName =?, lastName =?, phoneNumber =?, staffId =?
        WHERE id =?`;
    // Execute the query with the provided values
    db.query(query, [username, firstName, lastName, phoneNumber, staffId, id], (err, result) => {
        if (err) {
            console.error('Error updating users:', err);
            res.status(500).send('Error updating users');
        } else {
            // If the update is successful, send the result back to the client
            // Note: Depending on your database, you might want to send a success message or the updated user object
            res.send(result);
        }
    });
});

    
// Delete users
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting users:', err);
            res.status(500).send('Error deleting users');
        } else {
            res.send(result);
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

//set specific date for a week in audit form
app.get('/last-audit-date', (req, res) => {
    console.log('Fetching last audit date...');
    const query = 'SELECT MAX(date) AS last_date FROM audit_tasks';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching last audit date:', error);
            res.status(500).send('Error fetching last audit date');
        } else {
            console.log('Last audit date fetched successfully');
            if (Array.isArray(results) && results.length > 0) {
                const lastDate = results[0].last_date;
                if (lastDate) {
                    res.send({ date: lastDate });
                } else {
                    res.status(404).send('No audit tasks found');
                }
            } else {
                res.status(404).send('No audit tasks found');
            }
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

// Submit audit form data with image uploads
app.post('/submit-audit', upload, (req, res) => {
    // Parse the questions array from the request body
    let formData = req.body;
    if (typeof formData.questions === 'string') {
        formData.questions = JSON.parse(formData.questions);
    }

    // object to store the paths of the uploaded images
    const imagePaths = {};

    if (req.files) {
        formData.questions.forEach((q, index) => {
            const imageFieldName = `image${index + 1}`;
            if (req.files[imageFieldName] && req.files[imageFieldName].length > 0) {
                imagePaths[`image${index + 1}`] = req.files[imageFieldName][0].path;
            }
        });
    }

    const questionFields = [];
    const placeholders = [];
    formData.questions.forEach((q, index) => {
        questionFields.push(`question_${index + 1}`, `remark_${index + 1}`, `image_${index + 1}`, `comment_${index + 1}`);
        placeholders.push('?', '?', '?', '?');
    });

    const query = `INSERT INTO audits (area_name, audit_date, auditor_name, auditor_phone, ${questionFields.join(', ')}, suggestion) VALUES (?, ?, ?, ?, ${placeholders.join(', ')}, ?)`;

    const values = [formData.area_name, formData.audit_date, formData.auditor_name, formData.auditor_phone, ...formData.questions.flatMap((q, index) => [q.question, q.remark, imagePaths[`image${index + 1}`] || null, q.comment]), formData.suggestion];

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

// Submit audit form data
app.post('/submit-audit-form', async (req, res) => {
    console.log("triggered")
    console.log(Object.values(req.body))
    const [ date, taskId, auditArea, specificArea, reportObservation, remarks, suggestions, taskIdSpecific, actionTaken, progress ] = Object.values(req.body);
    
    if (!date || !taskId || !auditArea || !specificArea || !reportObservation || !remarks || !taskIdSpecific || !actionTaken || !progress) {
        return res.status(400).send({ message: 'All fields are required.' });
    }

    const query = 'INSERT INTO specific_task (date, task_id, audit_area, specific_area, report_observation, remarks, suggestions, task_id_specific, action_taken, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [date, taskId, auditArea, specificArea, reportObservation, remarks, suggestions, taskIdSpecific, actionTaken, progress];
    console.log(values)
    db.query(query, values, (error, results) => {
        console.log(error)
        if (error) {
            console.log(error)
            console.error('Error inserting audit form data:', error);
            return res.status(500).send({ message: 'Error inserting audit form data', error: error.message });
        } else {
            console.log("success")
        }
    });
});


// Fetch tasks by date range
app.get('/fetchTasks', (req, res) => {
    const { startDate, endDate } = req.query;
    console.log(startDate+"||"+endDate)
    if (!startDate || !endDate) {
        return res.status(400).send({ message: 'Both startDate and endDate must be provided.' });
    }

    const query = 'SELECT * FROM specific_task WHERE date BETWEEN ? AND ?';
    const values = [startDate, endDate];

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).send({ message: 'Database error', error: error.message });
        } else {
            res.send(results);
        }
    });
});


app.get('/fetchAllSpecificTasks', (req, res) => {
    const query = 'SELECT * FROM specific_task WHERE progress = "In Progress"';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).send({ message: 'Database error', error: error.message });
        } else {
            res.send(results);
        }
    });
});


app.get('/fetchTaskDetails', (req, res) => {
    const taskId = req.query.task_id_specific;
    const query = 'SELECT * FROM specific_task WHERE task_id_specific = ?';
    db.query(query, [taskId], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).send({ message: 'Database error', error: error.message });
        } else {
            res.send(results);
        }
    });
});

// Update task progress
app.post('/updateTaskProgress', (req, res) => {
    const { taskId, newProgress } = req.body;

    if (!taskId || !newProgress) {
        return res.status(400).send({ message: 'Both taskId and newProgress must be provided.' });
    }

    // Update the task's progress in the database
    const query = 'UPDATE specific_task SET progress = ? WHERE task_id_specific = ?';
    const values = [newProgress, taskId];

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).send({ message: 'Database error', error: error.message });
        } else if (results.affectedRows === 0) {
            // No rows were updated, which means the task_id_specific was not found
            res.status(404).send({ message: 'Task not found' });
        } else {
            // Fetch the updated task to return it
            const fetchQuery = 'SELECT * FROM specific_task WHERE task_id_specific = ?';
            db.query(fetchQuery, [taskId], (error, results) => {
                if (error) {
                    console.error('Database error:', error);
                    res.status(500).send({ message: 'Database error', error: error.message });
                } else {
                    // Assuming the task is found and updated successfully
                    res.send(results[0]); // Return the updated task
                }
            });
        }
    });
});

// Fetch specific task by date
app.get('/specific', (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).send({ message: 'Date must be provided.' });
    }

    const query = 'SELECT * FROM specific_task WHERE date = ?';
    const values = [date];

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).send({ message: 'Database error', error: error.message });
        }else {
            res.send(results);
        }
    });
});

//puppeter pdf download checkAudits
app.post('/generate-pdf', async (req, res) => {
    try {
        const { totalAreasCovered, totalObservationsFound, date, taskId,analysisWeek, auditsData } = req.body;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const areaCounts = {};
        auditsData.forEach(item => {
            if (!areaCounts[item.AuditArea]) {
                areaCounts[item.AuditArea] = 1;
            } else {
                areaCounts[item.AuditArea]++;
            }
        });

        // Generate the HTML template with rowspan logic
        let htmlContent = `
            <html>
            <head>
                <title>Report</title>
                <style>
                    @page {
                        margin: 1cm; 
                    }
                    body {
                        margin: 1cm; 
                        padding: 0;
                        box-sizing: border-box;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    img {
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                        width: 50%; 
                    }
                    tr:last-child {
                        border-bottom: 1px solid black;
                    }
                </style>
            </head>
            <body>
            <img src="http://localhost:8001/pdf/pdf/logo.png" alt="Logo">
            <h2 style="text-align:center">Office of the IQAC</h2>
            <h3 style="text-align:center">Remote Area Analysis Report - ${analysisWeek}</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div>Audit Date: ${date}</div>
                <div>Task ID: ${taskId}</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div>Total Areas Covered: ${totalAreasCovered}</div>
                <div>Total Observations Found: ${totalObservationsFound}</div>
            </div>
                <table>
                    <thead>
                        <tr>
                            <th>Serial Number</th>
                            <th>Audit Area</th>
                            <th>Specific Area</th>
                            <th>Report Observation</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        auditsData.forEach((item, index) => {
            // Check if this is the first item of a new area
            if (index === 0 || item.AuditArea !== auditsData[index - 1].AuditArea) {
                // Apply rowspan to the area name and serial number cells
                htmlContent += `
                    <tr>
                        <td rowSpan="${areaCounts[item.AuditArea]}">${item.SerialNumber}</td>
                        <td rowSpan="${areaCounts[item.AuditArea]}">${item.AuditArea}</td>
                        <td>${item.SpecificArea}</td>
                        <td>${item.ReportObservation}</td>
                        <td>${item.Remarks}</td>
                    </tr>
                `;
            } else {
                // For subsequent items of the same area, only add the specific area, report observation, remarks, and suggestions
                // Since we're assuming each area has two entries (male and female), we don't need to adjust the rowspan here
                htmlContent += `
                    <tr>
                        <td>${item.SpecificArea}</td>
                        <td>${item.ReportObservation}</td>
                        <td>${item.Remarks}</td>
                    </tr>
                `;
            }
        });
        
        htmlContent += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

        await page.setContent(htmlContent);
        const pdf = await page.pdf({ format: 'A4', landscape: true });

        await browser.close();

        // Send the PDF back to the client
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdf.length,
        });
        res.send(pdf);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

//puppeter pdf download specific tasks
app.post('/generate-pdf2', async (req, res) => {
    try {
        const { date, taskId,analysisWeek,completedTasksCount, pendingTasksCount, TasksCount, auditsData } = req.body;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const areaCounts = {};
        auditsData.forEach(item => {
            if (!areaCounts[item.AuditArea]) {
                areaCounts[item.AuditArea] = 1;
            } else {
                areaCounts[item.AuditArea]++;
            }
        });

        // Generate the HTML template with rowspan logic
        let htmlContent = `
            <html>
            <head>
                <title>Report</title>
                <style>
                    @page {
                        margin: 1cm; 
                    }
                    body {
                        margin: 1cm; 
                        padding: 0;
                        box-sizing: border-box;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    img {
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                        width: 50%; // Adjust the width as needed
                    }
                    tr:last-child {
                        border-bottom: 1px solid black;
                    }
                </style>
            </head>
            <body>
            <img src="http://localhost:8001/pdf/pdf/logo.png" alt="Logo">
            <h2 style="text-align:center">Office of the IQAC</h2>
            <h3 style="text-align:center">Remote Area Analysis Report - ${analysisWeek}</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div>Audit Date: ${date}</div>
                <div>Task ID: ${taskId}</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div>Number of Tasks: ${TasksCount}</div>
                <div>Completed Tasks: ${completedTasksCount}</div>
                <div>Pending Tasks: ${pendingTasksCount}</div>
            </div>
            </div>
                <table>
                    <thead>
                        <tr>
                            <th>Serial Number</th>
                            <th>Audit Area</th>
                            <th>Specific Area</th>
                            <th>Report Observation</th>
                            <th>Remarks</th>
                            <th>Task ID Specific</th>
                            <th>Action Taken</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        let currentAreaName = ''; 
        let serialNumber = 0;

        auditsData.forEach((item, index) => {

            if (item.AuditArea !== currentAreaName) {
                currentAreaName = item.AuditArea;
                serialNumber++;
            }

            const auditArea = item.AuditArea ;
            const specificArea = item.SpecificArea;
            const reportObservation = item.ReportObservation || ''; 
            const remarks = item.Remarks|| '';
            const taskIdSpecific = item.TaskIDSpecific || '';
            const actionTaken = item.ActionTaken || '';
            const progress = item.Progress || '';

            if (index === 0 || item.AuditArea !== auditsData[index - 1].AuditArea) {
                htmlContent += `
                        <tr>
                            <td rowSpan="${areaCounts[item.AuditArea]}">${serialNumber}</td>
                            <td rowSpan="${areaCounts[item.AuditArea]}">${auditArea}</td>
                            <td>${specificArea}</td>
                            <td>${reportObservation}</td>
                            <td>${remarks}</td>
                            <td>${taskIdSpecific}</td>
                            <td>${actionTaken}</td>
                            <td>${progress}</td>
                        </tr>
                        `;
            } else {
                htmlContent += `
                    <tr>
                        <td>${specificArea}</td>
                        <td>${reportObservation}</td>
                        <td>${remarks}</td>
                        <td>${taskIdSpecific}</td>
                        <td>${actionTaken}</td>
                        <td>${progress}</td>
                    </tr>
                `;
            }
        });
        
        htmlContent += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

        await page.setContent(htmlContent);
        const pdf = await page.pdf({ format: 'A4', landscape: true });

        await browser.close();

        // Send the PDF back to the client
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdf.length,
        });
        res.send(pdf);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

// app.post('/messages', async (req, res) => {
//     try {
//         const { sender_id, recipient_ids, message_content } = req.body;

//         // Validate the data
//         if (!sender_id || !recipient_ids || !message_content) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         // Loop through recipient_ids and insert a message for each
//         for (const recipient_id of recipient_ids) {
//             const query = 'INSERT INTO messages (sender_id, recipient_id, message_content) VALUES (?, ?, ?)';
//             const values = [sender_id, recipient_id, message_content];

//             db.query(query, values, (err, result) => {
//                 if (err) {
//                     console.error(err);
//                     return res.status(500).json({ error: 'Error inserting message' });
//                 }
//             });
//         }

//         // Respond to the client
//         res.status(200).json({ message: 'Messages sent successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });



   

// Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});