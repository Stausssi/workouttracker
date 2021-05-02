const sql = require("../createConnection");

const Activity = function () {
};

Activity.add = (activity, isAdded) => {
    sql.query(`INSERT INTO activity (${activity.valueKeys})
               VALUES (${activity.values});`, function (error, result) {
        if (error) {
            isAdded(error, false);
        } else {
            isAdded(null, true);
        }
    });
}

Activity.get = (user, response) => { 
    sql.query("SELECT activity_id ,sport as title, startedAt,duration FROM activity WHERE user = ?", [user],
        function (error, result) {
            if (error) {
                response(error, null)
            } else {
                response(null, result)
            }
        });
}


Activity.remove = (id, username, result) => {    
    sql.query("DELETE FROM activity WHERE activity_id = ? AND user = ?", [id, username], (error, res) => {
        if (error) {
            console.log("error: ", error);
            result(error, null);
        } else {
            result(null, true);
        }
    });
};

module.exports = Activity;
