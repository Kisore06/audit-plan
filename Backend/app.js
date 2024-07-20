const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const pool = require('./src/config/db');

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads/images', express.static('uploads/images'));


app.get('/', (req, res) => {
    res.send('Welcome to Audit Plan Management Server!');
});

const PORT = process.env.PORT || 8001;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
const shutdown = () => {
    console.log('SIGTERM or SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        pool.end(err => {
            if (err) {
                console.error('Error closing database pool:', err);
            } else {
                console.log('Database pool closed');
            }
        });
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

