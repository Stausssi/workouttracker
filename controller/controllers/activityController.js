const Activity = require("../../model/models/activityModel");
const mysql = require("mysql");
const {isParamMissing} = require("../utilities/misc");

exports.add = (req, res) => {
    if (isParamMissing([req.body, req.username])) {
        res.sendStatus(400);
    } else {
        let activity = req.body;
        let valueKeys = "`user`, ";
        let values = "'" + req.username + "', ";

        // Dynamically create keys and values to insert into the database
        for (let key in activity) {
            if (activity.hasOwnProperty(key)) {
                valueKeys +=  mysql.escapeId(key) + ", ";
                values += mysql.escape(activity[key], true) + ", ";
            }
        }

        activity = {
            valueKeys: valueKeys.substring(0, valueKeys.length - 2),
            values: values.substring(0, values.length - 2)
        };

        Activity.add(activity, function (error, isAdded) {
            if (error) {
                console.log("Error when saving activity to database: ", error);
                if (error.errno === 1452) {
                    res.status(500).send({
                        errno: 1,
                        message: "PKUser not found!"
                    });
                } else {
                    res.status(500).send({
                        errno: 2,
                        message: "Internal server error!"
                    });
                }
            } else {
                if (isAdded) {
                    res.sendStatus(201);
                } else {
                    res.status(500).send({message: "Activity not added!"});
                }
            }
        });
    }
}
