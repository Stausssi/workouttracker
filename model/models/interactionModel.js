const connection = require("../createConnection");

const Comment = function (comments) {
}

Comment.addCommentToDB = (req, isAdded) => {
    connection.query("INSERT INTO `comments` (`PrimaryKey`, `username`, `timestamp`, `PKactivity`, `text`) VALUES (NULL, ?, current_timestamp(), ?, ?)", [
        req.username,
        req.body.activity,
        req.body.text
    ], function (error, rows, fields) {
        if (error) {
            isAdded(error, false);
        } else {
            isAdded(null, true);
        }
    });
}

Comment.selectCommentsFromDB = (req, comments) => {        // keine join benötigt
    connection.query("SELECT comments.PrimaryKey AS id, comments.text, comments.timestamp, comments.username AS name FROM `comments` WHERE `PKactivity`=?;", [
        req.params.activity
    ], function (error, rows, fields) {
        if (error) {
            comments(error, null);
        } else {
            comments(null, "{" + "\"Rowdata\":" + JSON.stringify(rows) + "}");
        }
    });
}

Comment.invertThumbsUpInDB = (req, errorInDB) => {
    connection.query("SELECT * FROM thumbsUp WHERE `username_fk`=? AND `activity_id`=?;", [
        req.username,
        req.body.activity
    ], function (error, rows, fields) {
        if (error) {
            errorInDB(error);
        } else {
            if (rows.length === 0) {
                connection.query("INSERT INTO thumbsUp (`username_fk`, `activity_id`) VALUES (?, ?);", [
                    req.username,
                    req.body.activity
                ], function (error, rows, fields) {
                    errorInDB(error);
                });
            } else {
                connection.query("DELETE FROM thumbsUp WHERE `username_fk`=? AND `activity_id`=?;", [
                    req.username,
                    req.body.activity
                ], function (error, rows, fields) {
                    errorInDB(error);
                });
            }
        }
    });
}

Comment.isThumbsUpSetInDB = (req, isSet) => {
    connection.query("SELECT * FROM thumbsUp WHERE  `username_fk`=? AND `activity_id`=?;", [
        req.username,
        req.params.activity
    ], function (error, rows, fields) {
        if (error) {
            isSet(error, false);
        } else {
            if (rows.length === 0) {
                isSet(null, false);
            } else {
                isSet(null, true);
            }
        }
    });
}

Comment.countThumbsUpInAnActivity = (req, count) => {
    connection.query("SELECT COUNT(PrimaryKey) AS counter FROM thumbsUp WHERE `activity_id`=?;", [
        req.params.activity
    ], function (error, rows, fields) {
        if (error) {
            count(error, "{}");
        } else {
            count(null, JSON.stringify(rows));
        }
    });
}

module.exports = Comment;