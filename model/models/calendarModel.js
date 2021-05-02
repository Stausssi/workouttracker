const sql = require("../createConnection");

const Event = function (event) {    
    this.title= event.title,
    this.start= event.start,
    this.end= event.end,
    this.user= event.user
}

Event.get = (user, response) => { 
    sql.query("SELECT * FROM events where user = ?", [user],
        function (error, result) {
            if (error) {
                response(error, null)
            } else {
                response(null, result)
            }
        });
}

Event.getActivityEvents = (user, response) => { 
    sql.query("SELECT activity_id ,sport as title, startedAt,duration FROM activity WHERE user = ?", [user],
        function (error, result) {
            if (error) {
                response(error, null)
            } else {
                response(null, result)
            }
        });
}


Event.create = (newEvent, result) => {  
    sql.query("INSERT INTO events SET ?", [newEvent], (error, res) => {
        if (error) {
            console.log("error: ", error);
            result(newEvent, false);
        } else {
            result(null, true);
        }
    });
};

Event.remove = (id, username, result) => {  //remove event 
    sql.query("DELETE FROM events WHERE id = ? AND user = ?", [id, username], (error, res) => {
        if (error) {
            console.log("error: ", error);
            result(error, null);
        } else {
            result(null, true);
        }
    });
};

Event.removeActivity = (id, username, result) => {  //remove activity
    sql.query("DELETE FROM activity WHERE activity_id = ? AND user = ?", [id, username], (error, res) => {
        if (error) {
            console.log("error: ", error);
            result(error, null);
        } else {
            result(null, true);
        }
    });
};

module.exports = Event;
