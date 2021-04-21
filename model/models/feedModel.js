//get connection to database
const sql = require('../createConnection');

// formats an array of database activities into an object
const Feed = function(activity_array){
    // null values ? --> leave key out ?
    //same format that view expects
}

// returns the first 5 elements of a "user"s feed sorted by the most recent one,
// the parameter "start" determines the index of the starting element.
// start=5 : the function leaves out the five most recent records and returns the ones after that
// --> User can load new activities without having to load all recent activities
// Amount: how many records should be returned
// result: return possible errors or the results

Feed.getOwnFeed = (user, start, amount, result) => {
    // get last
    sql.query('SELECT * FROM activity WHERE user= ? ORDER BY addedAt DESC LIMIT ?, ?',
        [
            user,
            start,
            amount
        ], (error, db_results) => {
            if(error){
                //if an error occurs, return
                result(error, null);
            } else {
                // return db_results as Feed Object
                return new Feed(db_results)
            }
        });
}




module.exports = Feed;