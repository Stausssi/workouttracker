const { request } = require('express');
const Event = require("../../model/models/calendarModel");

//TODO: Add user for event

exports.findAll = (request, response) => {
  let username = request.username;
  Event.getAll((error, data) => {
    if (error) {
      console.log(error);
      response.sendStatus(500)
    } else {
      response.status(200).send({ body: JSON.stringify(data) });
    }
  });
};

exports.findActivityEvents = (request, response) => {
  let username = request.username;
  Event.getActivityEvents((error, data) => {
    if (error) {
      console.log(error);
      response.sendStatus(500)
    } else {
      response.status(200).send({ body: JSON.stringify(data) });
    }
  });
};

//Create new event and add it to DB
exports.create = (request, response) => {
  if (!request.body) {
    response.sendStatus(400)
  }
  else {
    let username = request.username;
    // constructor for event
    const event = new Event({
      title: request.body.title,
      start: request.body.start,
      end: request.body.end,
      allDay: request.body.allDay,
      //user:username
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
  if (!eventid/* || !username */) {
    response.sendStatus(400)
  }
  else {
    Event.remove(eventid, (error, data) => {
      if (error || !data) {
        response.sendStatus(500)
      } else {
        response.sendStatus(200)
      }
    })

  }
};

