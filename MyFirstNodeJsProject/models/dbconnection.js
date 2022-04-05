var config = require('../config/config');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: config.SMTPHOST,
    // port: config.SMTPPORT,
    user: config.SMTPUSER,
    password: config.SMTPPASSWORD,
    database: config.SMTPDATABASE,
});

con.connect(function(err) {
    if (err) {
        console.log('Cannot connect to Database' + err);
    } else {
        console.log('Connected to Database');
        console.log('Port Connected to 3000');
    }
});



module.exports = con;