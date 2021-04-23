const sql = require("../createConnection");

const Event = function(event) {
    /*this.title = event.title;
    this.start= event.start;
    this.end = event.end;
    this.allDay = event.allDay;
    this.user = event.user;*/
}

Event.getAll = (response) => {
    sql.query("SELECT * FROM events;",  //Where user = ?
        function (error, result) {
            if(error) {
                response(error, null)
            } else {
                    /*let events = {};
                    Object.values(JSON.parse(JSON.stringify(result))).forEach((item) => {
                        let event = item.id
                        let title = item.title
                        let start = item.start
                        let end = item.end
                        let allDay = item.allDay
                        events = Object.assign({}, events, {[event]: [title, start,end,allDay]});
                    })
  */
                    console.log("events: ", result);
                    response(null,result)
            }
    });
}

Event.getActivityEvents = (response) => {
    sql.query("SELECT activity_id ,sport as title, startedAt,duration  FROM activity;",  //Where user = ?
        function (error, result) {
            if(error) {
                response(error, null)
            } else {
                   /* let events = {};
                    Object.values(JSON.parse(JSON.stringify(result))).forEach((item) => {
                        let event = item.activity_id
                        let title = item.sport
                        let start = item.startedAt
                        let end = item.duration
                        let allDay = 1
                        events = Object.assign({}, events, {[event]: [title, start,end,allDay]});
                    })*/
  
                    console.log("events: ", result);
                    response(null,result)
            }
    });
}


Event.create = (newEvent, result) => {
    sql.query("INSERT INTO events SET ?", [newEvent], (error, res) => {
      if (error) {
        console.log("error: ", error);
        result(error, false);
      }
      else {
      console.log("created event: ", { newEvent });
      result(null, true);
      }
    });
  };

  Event.remove = (id, result)=>{
    sql.query("DELETE FROM events WHERE id = ?", [id], (error, res) => {
               if(error) {
                   console.log("error: ", error);
                   result(error, null);
               }
               else{
             result(null, true);
               }
           }); 
};

module.exports = Event;
