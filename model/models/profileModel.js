const connection = require("../createConnection");
const mysql = require("mysql");

const Profile = function (profile) {
}

Profile.selectProfileData = (req, profileData) => {
    connection.query("SELECT firstname, lastname, date, weight, email FROM user WHERE `username`=?;" , [
        req.username
    ], function(error, rows, fields){
        if(error) profileData(error, "{}");
        else profileData(null, JSON.stringify(rows));
    });
}

Profile.selectAllProfileDataForEmail = (username, profileData) => {
    connection.query("SELECT firstname, lastname, username, email, confirmationToken FROM user WHERE `username`=?;" , [
        username
    ], function(error, rows, fields){
        if(error) profileData(error, "{}");
        else profileData(null, rows);
    });
}

Profile.updateProfileInDB = (req, confirmationToken, resMessage) => {
    var sqlreq = "UPDATE user SET ";
    if(req.body.firstname || req.body.lastname || req.body.date || req.body.weight || req.body.email){
        if(req.body.firstname) sqlreq += "firstname=" + mysql.escape(req.body.firstname, true) + ", ";
        if(req.body.lastname) sqlreq += "lastname=" + mysql.escape(req.body.lastname, true) + ", ";
        if(req.body.date) sqlreq += "date=" + mysql.escape(req.body.date, true) + ", ";       //date insted of age
        if(req.body.weight) sqlreq += "weight=" + mysql.escape(req.body.weight, true) + ", ";
        if(req.body.email) sqlreq += "email=" + mysql.escape(req.body.email, true) + ", emailVerify=false, confirmationToken='" + confirmationToken + "'";
        sqlreq += "WHERE `username`=" + mysql.escape(req.username, true) + ";";
        sqlreq = sqlreq.replace(", WHERE"," WHERE");
        console.log(sqlreq);

        connection.query(sqlreq , function(error, rows, fields){
            console.log(error);

            if(error)  resMessage(error, '');
            else resMessage(null, 'PUT resived!')
        });
    }
    else resMessage(null, 'PUT is empty!');
}

module.exports = Profile;