const sql = require("./createConnection");

const Activity = function (activity) {
    this.sport = activity.sport;
}

Activity.add = (activity, isAdded) => {
    sql.query(`INSERT INTO activity (${activity.valueKeys}) VALUES (${activity.values});`, function (error, result) {
        if (error) {
            isAdded(error, false);
        } else {
            isAdded(null, true);
        }
    });
}

module.exports = Activity;