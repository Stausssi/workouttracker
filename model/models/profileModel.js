const connection = require("../createConnection");

const Profile = function (activity) {
    this.sport = activity.sport;
}

Profile.selectProfileData = (req, profileData) => {
    connection.query("SELECT firstname, lastname, age, weight, email FROM user WHERE `PrimaryKey`=?;" , [
        req.params.user
    ], function(error, rows, fields){//mit ? wegen konkatenation
        if(error) profileData(error, "{}");
        else profileData(null, resp.send(JSON.stringify(rows)));
    });
}

Profile.updateProfileInDB = (req, resMessage) => {
    var sqlreq = "UPDATE user SET ";
    if(req.body.firstname || req.body.lastname || req.body.age || req.body.weight || req.body.email){
        if(req.body.firstname) sqlreq += "firstname='" + req.body.firstname + "', ";
        if(req.body.lastname) sqlreq += "lastname='" + req.body.lastname + "', ";
        if(req.body.age) sqlreq += "age='" + req.body.age + "', ";
        if(req.body.weight) sqlreq += "weight='" + req.body.weight + "', ";
        if(req.body.email) sqlreq += "email='" + req.body.email + "', emailVerify=false ";
        sqlreq += "WHERE `PrimaryKey`='" + req.body.user + "';";
        sqlreq = sqlreq.replace(", WHERE"," WHERE");
        
        connection.query(sqlreq , function(error, rows, fields){
            if(error)  resMessage(error, '');
            else resMessage(null, 'PUT resived!')
        });
    }
    else resMessage(null, 'PUT is empty!');
}

module.exports = Profile;