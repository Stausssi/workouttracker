const sql = require("../createConnection");

const Event = function (event) {    //event constructor
    this.title = event.title;
    this.start = event.start;
    this.end = event.end;
    this.allDay = event.allDay;
    this.user = event.user;
}

Event.getAll = (user,response) => { //sql query to get all events which match with current user. Response with values on success
    sql.query("SELECT * FROM events where user = ?",[user],  
        function (error, result) {
            if (error) {
                response(error, null)
            } else {
                response(null, result)
            }
        });
}

Event.getActivityEvents = (response) => {
    sql.query("SELECT activity_id ,sport as title, startedAt,duration  FROM activity;",  //Where user = ?
        function (error, result) {
            if (error) {
                response(error, null)
            } else {
                response(null, result)
            }
        });
}


Event.create = (newEvent, result) => {  //sql query to insert event into DB
    sql.query("INSERT INTO events SET ?", [newEvent], (error, res) => {
        if (error) {
            console.log("error: ", error);
            result(newEvent, false);
        }
        else {
            result(null, true);
        }
    });
};

Event.remove = (id, username, result) => {  //remove event 
    sql.query("DELETE FROM events WHERE id = ? AND user = ?", [id,username], (error, res) => {
        if (error) {
            console.log("error: ", error);
            result(error, null);
        }
        else {
            result(null, true);
        }
    });
};

module.exports = Event;
