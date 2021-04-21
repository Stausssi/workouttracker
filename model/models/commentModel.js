const connection = require("../createConnection");

const Comment = function (comments) {
    this.sport = comments.sport;
}

Comment.addCommentToDB = (req, isAdded) => {
    connection.query("INSERT INTO `comments` (`PrimaryKey`, `PKUser`, `timestamp`, `PKactivity`, `text`) VALUES (NULL, ?, current_timestamp(), ?, ?)" , [
        req.username,
        req.body.activity,
        req.body.text
    ], function(error, rows, fields){
        if (error) isAdded(error, false);
        else isAdded(null, true);
    });
}

Comment.selectCommentsFromDB = (req, commends) => {        // keine join benötigt
    connection.query("SELECT Comments.PrimaryKey AS id, Comments.text, Comments.timestamp, User.firstname AS name FROM `Comments` INNER JOIN User ON Comments.PKUser=User.PrimaryKey WHERE `PKactivity`=?;" , [
        req.params.activity
    ], function(error, rows, fields){
        if (error) commends(error, null);
        else commends(null, "{" + "\"Rowdata\":" + JSON.stringify(rows) + "}");
    });
}

Comment.invertThumpsUpInDB = (req, errorInDB) => {        
    connection.query("SELECT * FROM `thumbsup` WHERE  `PKUser`=? AND `PKactivity`=?;" , [
        req.username,
        req.body.activity
    ], function(error, rows, fields){
        if(error) errorInDB(error);
        else {
            if(rows.length == 0) {
                connection.query("INSERT INTO `thumbsup` (`PrimaryKey`, `PKUser`, `PKactivity`) VALUES (NULL, ?, ?);" , [
                    req.username,
                    req.body.activity
                ], function(error, rows, fields){
                    if(error) errorInDB(error);
                });
            }else{
                connection.query("DELETE FROM `thumbsup` WHERE `PKUser`=? AND `PKactivity`=?;" , [
                    req.username,
                    req.body.activity
                ], function(error, rows, fields){
                    if(error) errorInDB(error);
                    else errorInDB(null);
                });
            }
        }
    });
}

Comment.isThumpsUpSetInDB = (req, isSet) => {       
    connection.query("SELECT * FROM `thumbsup` WHERE  `PKUser`=? AND `PKactivity`=?;" , [
        req.username,
        req.params.activity
    ], function(error, rows, fields){
        if (error) isSet(error, false);
        else {
            if(rows.length == 0) isSet(null, false);
            else isSet(null, true);
        }
    });
}

Comment.countThumpsUpInAnActivity = (req, count) => {       
    connection.query("SELECT COUNT(PrimaryKey) AS counter FROM `thumbsup` WHERE `PKactivity`=?;" , [
        req.params.activity
    ], function(error, rows, fields){
        if(error) count(error, "{}");
        else count(null, JSON.stringify(rows));
    });
}

module.exports = Comment;