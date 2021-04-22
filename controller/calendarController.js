const { request } = require('express');
const Event = require("../model/calendarModel");

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
      allDay: request.body.allDay
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
  if (!eventid) {
    response.sendStatus(400)
  }
  else {
    let username = request.username;
    Event.remove(eventid, (error, data) => {
      if (error) {
        response.sendStatus(500)
      } else {
        response.sendStatus(200)
      }
    })

  }
};

