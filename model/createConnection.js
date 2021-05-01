const mysql = require('mysql');
const dbConfig = require("./db.config.js");

// Create a connection to the database
// Keep in mind that an SSH Tunnel is necessary to connect to the database from remote
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

// open the MySQL connection
connection.connect(error => {
    if (error) {
        console.log(error);
        throw error;
    }

    console.log("Successfully connected to the database.");
});

module.exports = connection;
