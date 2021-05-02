const Event = require("../../model/models/calendarModel");
const {isParamMissing} = require("../utilities/misc");

exports.get = (request, response) => {
    //find events which belonged to currently logged user
    let username = request.username;
    if (isParamMissing([username])) { //return Bad Request if user is missing
        request.sendStatus(400)
    } else {
        Event.get(username, (error, data) => {
            if (error) {
                console.log(error);
                response.sendStatus(500)
            } else {
                response.status(200).send({body: JSON.stringify(data)});  //return events if sql request has succeeded
            }
        });
    }
};


//Create new event and add it to DB
exports.create = (request, response) => {
    let username = request.username;
    if (!request.body || isParamMissing([username])) {
        response.sendStatus(400)
    } else {
        // constructor for event
        const event = new Event({
            title: request.body.title,
            start: request.body.start,
            end: request.body.end,
            user: username
        });
        // Save event in the database
        Event.create(event, (error, added) => {
            if (error || !added) {
                response.sendStatus(500)
            } else {
                response.sendStatus(200)
            }
        });
    }
};

//remove event from DB
exports.remove = (request, response) => {
    const eventId = request.body.id //id of event, to identify dataset which will be deleted
    let username = request.username;
    if (!request.body || isParamMissing([username, eventId])) {
        response.sendStatus(400)
    } else {
        Event.remove(eventId, username, (error, data) => {
            if (error || !data) {
                response.sendStatus(500)
            } else {
                response.sendStatus(200)
            }
        })

    }
};


