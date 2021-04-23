const Activity = require("../../model/models/activityModel");

exports.add = (req, res) => {
    if (!req.body) {
        res.status(400).send({message: "Bad request"});
    } else {
        let activity = req.body;
        let valueKeys = "user, ";
        let values = "'" + req.username + "', ";

        // Dynamically create keys and values to insert into the database
        for (let key in activity) {
            if (activity.hasOwnProperty(key)) {
                valueKeys +=  key + ", ";
                values += "'" + activity[key] + "', ";
            }
        }

        req.body = {
            valueKeys: valueKeys.substring(0, valueKeys.length - 2),
            values: values.substring(0, values.length - 2)
        };

        Activity.add(req.body, function (error, isAdded) {
            if (error) {
                console.log("Error when saving activity to database:", error);
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
                    res.status(200).send({message: "Activity added!"});
                } else {
                    res.status(500).send({message: "Activity not added!"});
                }
            }
        });
    }
}
