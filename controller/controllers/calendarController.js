const { request } = require('express');
const Event = require("../../model/models/calendarModel");
const { isParamMissing } = require("../utilities/misc");

exports.findAll = (request, response) => {
  let username = request.username;
  if (isParamMissing([username])) {
    request.sendStatus(400)
  }
  else {
    Event.getAll(username,(error, data) => {  
      if (error) {
        console.log(error);
        response.sendStatus(500)
      } else {
        response.status(200).send({ body: JSON.stringify(data) });
      }
    });
  }
};

exports.findActivityEvents = (request, response) => {
  let username = request.username;
  if (isParamMissing([username])) {
    request.sendStatus(400)
  }
  else {
    Event.getActivityEvents((error, data) => {
      if (error) {
        console.log(error);
        response.sendStatus(500)
      } else {
        response.status(200).send({ body: JSON.stringify(data) });
      }
    });
  }
};

//Create new event and add it to DB
exports.create = (request, response) => {
  let username = request.username;
  if (!request.body || isParamMissing([username])) {
    response.sendStatus(400)
  }
  else {
    // constructor for event
    const event = new Event({
      title: request.body.title,
      start: request.body.start,
      end: request.body.end,
      allDay: request.body.allDay,
      user:username
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

exports.remove = (request, response) => {
  const eventid = request.body.id
  let username = request.username;
  if (!request.body || isParamMissing([username,eventid])) {
    response.sendStatus(400)
  }
  else {
    Event.remove(eventid,username, (error, data) => {
      if (error || !data) {
        response.sendStatus(500)
      } else {
        response.sendStatus(200)
      }
    })

  }
};

