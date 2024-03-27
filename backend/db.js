const mysql = require('mysql')

// Create a connection to the database
const db = mysql.createConnection({
    user     : 'root',
    password : '',
    database : 'ramblogdb'
});

module.exports = db;

