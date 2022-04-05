var config = require('../config/config');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: config.SMTPHOST,
    port: config.SMTPPORT,
    user: config.SMTPUSER,
    password: config.SMTPPASSWORD,
    database: config.SMTPDATABASE,
});

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "my_first_node_db"
// });

con.connect(function(err) {
    if (err) {
        console.log('Cannot connect to Database' + err);
    } else {
        console.log('Connected to Database');
    }
});

// con.connect(function(err) {
//     if (err) {
//         console.log('Cannot connect to Database' + err);
//     } else {
//         console.log('Connected to Database');
//         con.query("SELECT * FROM employee_detials", function(err, result, fields) {
//             if (err) throw err;
//             console.log(result);
//             console.log("Config : ", process.env.HOST)
//         });
//     }
// });


module.exports = con;