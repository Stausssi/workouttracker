const connection = require("../createConnection");

const Profile = function (profile) {
}

Profile.selectProfileData = (req, profileData) => {
    connection.query("SELECT firstname, lastname, date, weight, email FROM user WHERE `username`=?;" , [
        req.params.user
    ], function(error, rows, fields){
        console.log(rows);
        if(error) profileData(error, "{}");
        else profileData(null, JSON.stringify(rows));
    });
}

Profile.updateProfileInDB = (req, resMessage) => {
    var sqlreq = "UPDATE user SET ";
    if(req.body.firstname || req.body.lastname || req.body.age || req.body.weight || req.body.email){
        if(req.body.firstname) sqlreq += "firstname='" + req.body.firstname + "', ";
        if(req.body.lastname) sqlreq += "lastname='" + req.body.lastname + "', ";
        if(req.body.age) sqlreq += "date='" + req.body.age + "', ";       //date insted of age
        if(req.body.weight) sqlreq += "weight='" + req.body.weight + "', ";
        if(req.body.email) sqlreq += "email='" + req.body.email + "', emailVerify=false ";
        sqlreq += "WHERE `username`='" + req.username + "';";
        sqlreq = sqlreq.replace(", WHERE"," WHERE");
        
        connection.query(sqlreq , function(error, rows, fields){
            if(error)  resMessage(error, '');
            else resMessage(null, 'PUT resived!')
        });
    }
    else resMessage(null, 'PUT is empty!');
}

module.exports = Profile;