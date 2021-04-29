const Comment = require("../../model/models/interactionModel");

//add new comment
exports.addComment = (req, res) => {
    Comment.addCommentToDB(req, function (error, isAdded) {
        res.sendStatus(error || !isAdded ? 500 : 201);
    });
}

//get all comments
exports.getComment = (req, res) => {
    Comment.selectCommentsFromDB(req, function (error, comments) {
        if (error) {
            res.sendStatus(500);
        } else {
            if (comments) {
                res.status(200).send(comments);
            } else {
                res.status(500).send({message: "No comment found!"});
            }
        }
    });
}

//!thumbsUp if thumbsUp button is pressed
exports.thumbsUp = (req, res) => {
    Comment.invertThumbsUpInDB(req, function (error) {
        res.sendStatus(error ? 500 : 200);
    });
}


//is thumbsUp set ?
exports.isThumbsUpSet = (req, res) => {
    Comment.isThumbsUpSetInDB(req, function (error, isSet) {
        if (error) {
            res.sendStatus(500);
        } else {
            res.status(200).send(isSet);
        }
    });
}

//count thumbsUp set
exports.countThumbs = (req, res) => {
    Comment.countThumbsUpInAnActivity(req, function (error, count) {
        if (error) {
            res.sendStatus(500);
        } else {
            res.status(200).send(count);
        }
    });
}