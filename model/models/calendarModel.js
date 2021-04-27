const sql = require("../createConnection");

const Event = function (event) {
    this.title = event.title;
    this.start = event.start;
    this.end = event.end;
    this.allDay = event.allDay;
    this.user = event.user;
}

Event.getAll = (user,response) => {
    sql.query("SELECT * FROM events where user = ?",[user],  
        function (error, result) {
            if (error) {
                response(error, null)
            } else {
                console.log("events: ", result);
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
                console.log("events: ", result);
                response(null, result)
            }
        });
}


Event.create = (newEvent, result) => {
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

Event.remove = (id, username, result) => {
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
