const Comment = require("../../model/models/commentModel");

//add new comment
exports.addComment = (req, resp) => {
    Comment.addCommentToDB(req, function (error, isAdded) {
        if (error) {
            resp.status(500).send({
                errno: 2,
                message: "Internal server error!"
            });
        } else {
            if (isAdded) {
                resp.status(200).send({message: "Comment added!"});
            } else {
                resp.status(500).send({message: "Comment not added!"});
            }
        }
    });
}

//get all comments
exports.getComment = (req, resp) => { 
    Comment.selectCommentsFromDB(req, function (error, comments) {
        if (error) {
            resp.status(500).send({
                errno: 2,
                message: "Internal server error!"
            });
        } else {
            if (comments) {
                resp.status(200).send(comments);
            } else {
                resp.status(500).send({message: "No comment found!"});
            }
        }
    });
}

//!thumbsUp if thumbsUp button is pressed
exports.thumbsUp = (req, resp) => {
    Comment.invertThumbsUpInDB(req, function (error) {
        if (error) {
            resp.status(500).send({
                errno: 2,
                message: "Internal server error!"
            });
        } else {
            resp.status(200).send('New Thumps State set!');
        }
    });
}


//is thumbsup set ?
exports.isThumbsUpSet = (req, resp) => {
    Comment.isThumbsUpSetInDB(req, function (error, isSet) {
        if (error) {
            resp.status(500).send({
                errno: 2,
                message: "Internal server error!"
            });
        } else resp.status(200).send(isSet);
    });
}

//count thumbsup set
exports.countThumbs = (req, resp) => {
    Comment.countThumbsUpInAnActivity(req, function (error, count) {
        if (error) {
            resp.status(500).send({
                errno: 2,
                message: "Internal server error!"
            });
        } else resp.status(200).send(count);
    });
}