const sql = require("./createConnection");

const Activity = function (activity) {
    this.sport = activity.sport;
}

Activity.add = (activity, isAdded) => {
    let valueKeys = "";
    let values = "";

    for (let key in activity) {
        if (activity.hasOwnProperty(key)) {
            valueKeys +=  key + ", ";
            values += "'" + activity[key] + "', ";
        }
    }

    valueKeys = valueKeys.substring(0, valueKeys.length - 2);
    values = values.substring(0, values.length - 2);

    sql.query(`INSERT INTO activity (PKuser, ${valueKeys}) VALUES ('0', ${values});`, function (error, result) {
        if (error) {
            isAdded(error, false);
        } else {
            isAdded(null, true);
        }
    });
}

module.exports = Activity;