const connection = require("../createConnection");

const Comment = function (comments) {
}

Comment.addCommentToDB = (req, isAdded) => {
    connection.query("INSERT INTO `comments` (`PrimaryKey`, `username`, `timestamp`, `PKactivity`, `text`) VALUES (NULL, ?, current_timestamp(), ?, ?)" , [
        req.username,
        req.body.activity,
        req.body.text
    ], function(error, rows, fields){
        if (error) isAdded(error, false);
        else isAdded(null, true);
    });
}

Comment.selectCommentsFromDB = (req, commends) => {        // keine join benötigt
    connection.query("SELECT comments.PrimaryKey AS id, comments.text, comments.timestamp, comments.username AS name FROM `comments` WHERE `PKactivity`=?;" , [
        req.params.activity
    ], function(error, rows, fields){
        console.log(error);

        if (error) commends(error, null);
        else commends(null, "{" + "\"Rowdata\":" + JSON.stringify(rows) + "}");
    });
}

Comment.invertThumpsUpInDB = (req, errorInDB) => {
    connection.query("SELECT * FROM `thumbsup` WHERE  `username_fk`=? AND `activity_id`=?;" , [
        req.username,
        req.body.activity
    ], function(error, rows, fields){
        if(error) errorInDB(error);
        else {
            if(rows.length == 0) {
                connection.query("INSERT INTO `thumbsup` (`PrimaryKey`, `username_fk`, `activity_id`) VALUES (NULL, ?, ?);" , [
                    req.username,
                    req.body.activity
                ], function(error, rows, fields){
                    if(error) errorInDB(error);
                });
            }else{
                connection.query("DELETE FROM `thumbsup` WHERE `username_fk`=? AND `activity_id`=?;" , [
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
    connection.query("SELECT * FROM `thumbsup` WHERE  `username_fk`=? AND `activity_id`=?;" , [
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
    connection.query("SELECT COUNT(PrimaryKey) AS counter FROM `thumbsup` WHERE `activity_id`=?;" , [
        req.params.activity
    ], function(error, rows, fields){
        if(error) count(error, "{}");
        else count(null, JSON.stringify(rows));
    });
}

module.exports = Comment;