const Feed = require("../../model/models/feedModel");
const elementPerRequest = 5; // number of activities that are sent within one request

// returns the activity feed of a user or of the users friends based on the parameter "type"
// type: own --> own feed
// type: friends --> friends feed

exports.getFeed = (req, res) => {
    const type = req.params.type;
    const user = req.username;
    const start_offset = req.query.offset * elementPerRequest;

    // handle INPUT !!!!!!!!!!!!!!!!!!!!!!!

    if(type === "own"){
        // query database
        Feed.getOwnFeed(user, start_offset , elementPerRequest, (error, result) => {
            if(error){
                res.status(500).send({message:"server Error"});
            }else{
                
            }
        });
    } else if (type === "friends") {
        // query database
    } else {
        // Resource not found --> HTTP Status Code: 404
        res.status(404).send({message: "resource not found"})
    }
}