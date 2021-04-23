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
    // constructor for event
    const event = new Event({
      title: request.body.title,
      start: request.body.start,
      end: request.body.end,
      allDay: request.body.allDay
    });
    //response.status(200).send("test")
    // Save event in the database
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

  exports.remove = (request, response) => {
    if (!request.body) {
      response.status(400).send({
        message: "Content can not be empty!"
      });
    }
  else {
    // update an event
    //TODO
   /* sql.query("DELETE FROM customers WHERE id = ?", id, (error, response) => {
      if (error) {
        console.log(error);
        response.status(500).send({message: "Internal server error!"});
      }
  
      if (response.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        response.status(404).send({message: "event was not found"});
      }
  
      console.log("deleted customer with id: ", id);
      result(null, error);
    });*/
    
  }   
};