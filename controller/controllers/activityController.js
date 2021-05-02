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
                valueKeys += mysql.escapeId(key) + ", ";
                values += mysql.escape(activity[key], true) + ", ";
            }
        }

        activity = {
            valueKeys: valueKeys.substring(0, valueKeys.length - 2),
            values: values.substring(0, values.length - 2)
        };

        // Insert new activity into database
        Activity.add(activity, function (error, isAdded) {
            if (error) {
                console.log("Error when saving activity to database: ", error);

                // Mysql error 1452 is 'invalid foreign key'
                if (error.errno === 1452) {
                    res.status(500).send({
                        errno: 1,
                        message: "PKUser not found!"
                    });
                } else {
                    // Send general error
                    res.sendStatus(500);
                }
            } else {
                res.sendStatus(isAdded ? 201 : 500);
            }
        });
    }
}


//find activity which belonged to currently logged user
exports.get = (request, response) => {
    let username = request.username;
    if (isParamMissing([username])) { //return bad Request if user is missing
        request.sendStatus(400)
    } else {
        Activity.get(username, (error, data) => {
            if (error) {
                console.log(error);
                response.sendStatus(500)
            } else {
                response.status(200).send({body: JSON.stringify(data)});  //return events if sql request has succeeded
            }
        });
    }
};

//remove activity from DB
exports.remove = (request, response) => {
    const activityid = request.body.id //id of event, to identify dataset which will be deleted
    let username = request.username;
    if (!request.body || isParamMissing([username, eventid])) {
        response.sendStatus(400)
    } else {
        Activity.remove(activityid, username, (error, data) => {
            if (error || !data) {
                response.sendStatus(500)
            } else {
                response.sendStatus(200)
            }
        })

    }
};
