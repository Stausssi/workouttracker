const connection = require("../../model/createConnection");



//add new comment
exports.addCommend = (req, resp) => {
    resp.send('POST resived')
    connection.query("INSERT INTO `comments` (`PrimaryKey`, `PKUser`, `timestamp`, `PKactivity`, `text`) VALUES (NULL, '" + req.body.user + "', current_timestamp(), '" + req.body.activity + "', '" + req.body.text + "')" , function(error, rows, fields){
        if(error) {
            console.log(error);
        }
        else {
            console.log('Successful query');
            //hier ist das ergebnis in rows
        }
    });
}

//get all comments
exports.getComment = (req, resp) => {
    connection.query("SELECT Comments.PrimaryKey AS id, Comments.text, Comments.timestamp, User.firstname AS name FROM `Comments` INNER JOIN User ON Comments.PKUser=User.PrimaryKey WHERE `PKactivity`='" + req.params.activity + "';" , function(error, rows, fields){
        if(error) {
            console.log(error);
        }
        else {
            //hier ist das ergebnis
            resp.send("{" + "\"Rowdata\":" + JSON.stringify(rows) + "}");
        }
    });
}

//!thumpsup
exports.thumpsup = (req, resp) => {
    resp.send('POST resived')
    console.log(req.body.text);
    connection.query("SELECT * FROM `thumbsup` WHERE  `PKUser`='" + req.body.user + "' AND `PKactivity`='" + req.body.activity + "';" , function(error, rows, fields){
        if(error) {
            console.log(error);
        }
        else {
            console.log('Successful query');
            //hier ist das ergebnis in rows
            console.log(rows.length);
            if(rows.length == 0) {
                connection.query("INSERT INTO `thumbsup` (`PrimaryKey`, `PKUser`, `PKactivity`) VALUES (NULL, '" + req.body.user + "', '" + req.body.activity + "');" , function(error, rows, fields){
                    if(error) {
                        console.log(error);
                    }
                    else {
                        console.log('Successful query');
                        //hier ist das ergebnis in rows
                    }
                });
            }else{
                connection.query("DELETE FROM `thumbsup` WHERE `PKUser`=" + req.body.user + " AND `PKactivity`=" + req.body.activity + ";" , function(error, rows, fields){
                    if(error) {
                        console.log(error);
                    }
                    else {
                        console.log('Successful query');
                        //hier ist das ergebnis in rows
                    }
                });
            }
        }
    });
}


//is thumpsup set ?
exports.isthumpsupset = (req, resp) => {
    connection.query("SELECT * FROM `thumbsup` WHERE  `PKUser`='" + req.body.user + "' AND `PKactivity`='" + req.body.activity + "';" , function(error, rows, fields){
        if(error) {
            console.log(error);
        }
        else {
            console.log('Successful query');
            //hier ist das ergebnis in rows
            console.log(rows.length);
            if(rows.length == 0) {
                resp.send(false);
            }else{
                resp.send(true);
            }
        }
    });
}

//count thumpsup set
exports.countThumps = (req, resp) => {
    connection.query("SELECT COUNT(PrimaryKey) AS counter FROM `thumbsup` WHERE `PKactivity`=" + req.params.activity + ";" , function(error, rows, fields){
        if(error) {
            console.log(error);
        }
        else {
            //hier ist das ergebnis
            resp.send(JSON.stringify(rows));
        }
    });
}

//get data to Profile
exports.profilesite = (req, resp) => {
    connection.query("SELECT firstname, lastname, age, weight, email FROM user WHERE `PrimaryKey`=" + req.params.user + ";" , function(error, rows, fields){
        if(error) {
            console.log(error);
        }
        else {
            //hier ist das ergebnis
            resp.send(JSON.stringify(rows));
        }
    });
}

//update Profile
exports.profileUpdate = (req, resp) => {
    var sqlreq = "UPDATE user SET ";
    if(req.body.firstname || req.body.lastname || req.body.age || req.body.weight || req.body.email){
        if(req.body.firstname) sqlreq += "firstname='" + req.body.firstname + "', ";
        if(req.body.lastname) sqlreq += "lastname='" + req.body.lastname + "', ";
        if(req.body.age) sqlreq += "age='" + req.body.age + "', ";
        if(req.body.weight) sqlreq += "weight='" + req.body.weight + "', ";
        if(req.body.email) sqlreq += "email='" + req.body.email + "', emailVerify=false ";
        sqlreq += "WHERE `PrimaryKey`=" + req.body.user + ";";
        sqlreq = sqlreq.replace(", WHERE"," WHERE");
        
        connection.query(sqlreq , function(error, rows, fields){
            if(error) {
                console.log(error);
            }
            else {
                //hier ist das ergebnis
                resp.send('PUT resived')
            }
        });
    }
    else resp.send('PUT is empty');
}