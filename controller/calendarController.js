const { request } = require('express');
const Calendar = require("../model/calendarModel");

exports.findAll = (request, response) => {
    Calendar.getAll((error, data) => {
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
  
    // Create a Event
    const event = new Event({
      title: request.body.title,
      startdate: request.body.startdate,
      enddate: request.body.enddate
    });
  
    // Save Event in the database
    Event.create(event, (error, data) => {
      if (error) {
            console.log(error);
            response.status(500).send({message: "Internal server error!"});
        } else {
          response.send(data);
      }
    });
  };
