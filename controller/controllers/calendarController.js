const { request } = require('express');
const Event = require("../model/models/calendarModel");

//TODO: Add user for event

exports.findAll = (request, response) => {
    Event.getAll((error, data) => {
        if (error) {
            console.log(error);
            response.status(500).send({message: "Internal server error!"});
        } else{
            response.status(200).send({body: JSON.stringify(data)});
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
    // constructor for event
    const event = new Event({
      title: request.body.title,
      start: request.body.start,
      end: request.body.end,
      allDay: request.body.allDay
    });
    //response.status(200).send("test")
    // Save event in the database
    Event.create(event, (error, added) => {
      if (error) {
            response.status(500).send({message: "Internal server error!"});
        } else if(!added)
          {
            response.status(500).send({message: "Event could not be added"});
          } else {
            response.status(200).send({message: "New event was successfully be added!"});
          }
    });
}   
  };

  exports.remove = (request, response) => {
    const eventid=request.body.id
    if (!eventid) {
      response.status(400).send({
        message: "Bad Request: ID can not be empty!"
      });
    }
  else {
    Event.remove(eventid,(error,data)=>
    {
      if (error) {
        response.status(500).send({message: "Internal server error!"});
    } else {
        response.status(200).send({message: "Event was successfully deleted!"});
       
      }
})
    
  }   
};

  exports.update = (request, response) => {
    if (!request.body) {
      response.status(400).send({
        message: "Content can not be empty!"
      });
    }
    else {
      // update an event
    //TODO
   /* Event.updateById = (id, customer, result) => {
      sql.query(
        "UPDATE events SET title = ?, start = ?, end = ? allDay = ? WHERE id = ?",
        [event.title, event.start, event.end, event.allDay, id],
        (error, res) => {
          if (error) {
            console.log(error);
            response.status(500).send({message: "Internal server error!"});
          }
          else
          {
    
          if (res.affectedRows == 0) {
            // not found Customer with the id
            result({ kind: "not_found" }, null);
            response.status(404).send({message: "event was not found"});
          }
    
          console.log("updated event: ", { id: id, ...event });
          result(null, { id: id, ...event });
        }
      }
      );
    };*/
    }   
  };
