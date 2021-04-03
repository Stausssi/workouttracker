const sql = require("./createConnection");

const Activity = function(activity) {
    this.sport = activity.sport;
}

Activity.add = (isAdded) => {
    sql.query("SELECT * FROM sport;",
        function (error, result) {
            if(error) {
                isAdded(error, null);
            } else {
                isAdded(null, true);
            }
    });
}

module.exports = Activity;