const Feed = require("../../model/models/feedModel");
const elementPerRequest = 5; // number of activities that are sent within one request

// returns the activity feed of a user or of the users friends based on the parameter "type"
// type: own --> own feed
// type: friends --> friends feed

exports.getFeed = (req, res) => {
    const type = req.params.type;
    const user = req.query.user ? req.query.user: req.username;
    const start_offset = parseInt(req.query.offset);

    if (type === "own") {
        // query database
        Feed.getOwnFeed(user, start_offset, elementPerRequest, (error, result) => {
            if (error) {
                res.sendStatus(500);
            } else {
                //Send back JSON Feed Data
                res.status(200).send(JSON.stringify(result));
            }
        });
    } else if (type === "following") {
        // query database
        Feed.getFollowingFeed(user, start_offset, elementPerRequest, (error, result) => {
            if (error) {
                res.sendStatus(500);
            } else {
                //Send back JSON Feed Data
                res.status(200).send(JSON.stringify(result));
            }
        });
    } else {
        // Resource not found --> HTTP Status Code: 404
        res.sendStatus(404);
    }
}