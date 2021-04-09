const { request } = require('express');
const Event = require("../model/calendarModel");

exports.findAll = (request, response) => {
    Event.getAll((error, data) => {
        if (error) {
            console.log(error);
            response.status(500).send({message: "Internal server error!"});
        } else{
            response.send(data);
        } 
      });
};

//Create new event and add it to DB
exports.create = (request, response) => {
    if (!request.body) {
      response.status(400).send({
        message: "Content can not be empty!"
      });
    }
  else {
    // Create a Event
    const event = new Event({
      title: request.body.title,
      start: request.body.start,
      end: request.body.end,
      allDay: request.body.allDay
    });
    //response.status(200).send("test")
    // Save Event in the database
    Event.create(event, (error, data) => {
      if (error) {
            console.log(error);
            console.log(data)
            response.status(500).send({message: "Internal server error!"});
        } else {
          response.send(data);
      }
    });
}   
  };
