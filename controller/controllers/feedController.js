

// returns the activity feed of a user or of the users friends based on the parameter "type"
// type: own --> own feed
// type: friends --> friends feed

exports.getFeed = (req, res) => {
    const type = req.params.type
    if(type === "own"){
        // query database
        Feed
    } else if (type === "friends") {
        // query database
    } else {
        // Resource not found --> HTTP Status Code: 404
        res.status(404).send({message: "resource not found"})
    }
}