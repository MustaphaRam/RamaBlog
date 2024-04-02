const mysql = require('mysql')

// Create a connection to the database
const db = mysql.createConnection({
    user     : 'root',
    password : '',
    database : 'ramblogdb'
});

db.connect((err) => {
    if(err){
        throw err
    } else {
        console.log("connect db mysql");
    }
});

module.exports = db;

