//get connection to database
const sql = require('../createConnection');

// formats an array of database activities into an object
const Feed = function (activity_array) {
    // null values ? --> leave key out ?
    //same format that view expects
    this.activities = [];

    activity_array.forEach((row) => {
        this.activities.push({
            likes: row.likes,
            activityData: {
                distance: row.distance,
                duration: row.duration,
                pace: row.pace,
                averageHeartRate: row.averageHeartRate,
                altitudeDifference: row.altitudeDifference
            },
            username: row.user,
            sport: row.sport,
            addedAt: row.addedAt
        });
    });
}

// returns the first 5 elements of a "user"s feed sorted by the most recent one,
// the parameter "start" determines the index of the starting element.
// start=5 : the function leaves out the five most recent records and returns the ones after that
// --> User can load new activities without having to load all recent activities
// Amount: how many records should be returned
// result: return possible errors or the results result(error: Boolean, return: Object)

Feed.getOwnFeed = (user, start, amount, result) => {
    sql.query('SELECT * FROM ' +
        '(SELECT * FROM activity WHERE user=? ORDER BY addedAt DESC LIMIT ?, ?) activities ' +
        'LEFT OUTER JOIN ' +
        '(SELECT COUNT(username_fk) as likes, activity_id FROM thumbsUp GROUP BY activity_id) likecount ' +
        'USING(activity_id)',
        [
            user,
            start,
            amount
        ], (error, db_results, fields) => {
            if (error) {
                //if an error occurs, return
                console.log(error)
                result(true, null); // Error == True
            } else {
                // return db_results as Feed Object
                result(false, new Feed(db_results));
            }
        });
}


//Docstring
Feed.getFollowingFeed = (user, start, amount, result) => {
    //get Feed for users that "user" is following, just like in getOwnFeed() and append the number of likes for each post
    sql.query('SELECT * FROM ' +
        '(SELECT * FROM activity WHERE user in ' +
        '(SELECT followed FROM following WHERE follower=?) ' +
        'ORDER BY addedAt DESC LIMIT ?, ?) activities ' +
        'LEFT OUTER JOIN ' +
        '(SELECT COUNT(username_fk) as likes, activity_id FROM thumbsUp GROUP BY activity_id) likecount ' +
        'USING(activity_id)',
        [
            user,
            start,
            amount
        ], (error, db_results, fields) => {
            if (error) {
                //if an error occurs, return
                console.log(error)
                result(true, null); // Error == True
            } else {
                // return db_results as Feed Object
                result(false, new Feed(db_results));
            }
        });
}

module.exports = Feed;