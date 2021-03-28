//establish database connection
const connection = require('./createConnection');

//import other modules

//const authentification = require('./authentification');


function testquery(){
    connection.query("SELECT * FROM `user` WHERE `username` LIKE 'test'", function(err, rows, fields) {
    if (err) throw err;
    console.log('Output', rows[0]);
  });
}

exports.testquery = testquery;