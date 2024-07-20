const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'audit-plan',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Handling connection errors
pool.on('error', (err) => {
    console.error('MySQL pool error:', err);
  });

module.exports = pool.promise();