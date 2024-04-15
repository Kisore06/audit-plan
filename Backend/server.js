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


// Fetch audits by date and aggregate data
app.get('/audits/aggregated', async (req, res) => {
    console.log('Fetching aggregated audits...');

    const { date } = req.query;

    if (!date) {
        return res.status(400).send('Date must be provided.');
    }

    try {
        // Fetch areas
        const areasQuery = 'SELECT * FROM remote_area_weekly';
        const areasResult = await db.query(areasQuery);

        // Ensure areasResult is an array
        if (!Array.isArray(areasResult)) {
            return res.status(500).send('Error fetching areas.');
        }

        // Fetch audits for the specified date
        const auditsQuery = 'SELECT * FROM audits WHERE audit_date = ?';
        const auditsResult = await db.query(auditsQuery, [date]);

        // Ensure auditsResult is an array
        if (!Array.isArray(auditsResult)) {
            return res.status(500).send('Error fetching audits.');
        }

        // Aggregate data
        const aggregatedData = areasResult.reduce((acc, area) => {
            const areaAudits = auditsResult.filter(audit => audit.area_name.startsWith(area.area));
            const hasDiscrepancies = areaAudits.some(audit => audit.remarks.includes('bad') || audit.comment_1.includes('bad') || audit.comment_2.includes('bad'));

            acc[area.area] = {
                area_name: area.area,
                audit_date: date,
                reportObservation: hasDiscrepancies ? `Discrepancies found in ${area.area}.` : 'No discrepancies found.',
                remarks: areaAudits.map(audit => audit.remarks).join(' ')
            };

            return acc;
        }, {});

        // Convert the aggregated data object to an array
        const aggregatedArray = Object.values(aggregatedData);

        console.log('Aggregated audits fetched successfully.');
        res.send(aggregatedArray);
    } catch (error) {
        console.error('Error fetching aggregated audits:', error);
        res.status(500).send('Error fetching aggregated audits.');
    }
});

        


// Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
