const sql = require("./createConnection");

const Event = function(event) {
    this.title = event.title;
    this.startdate= event.startdate;
    this.enddate = event.enddate;
    //this.allday = events.allday;
}

Event.getAll = (response) => {
    sql.query("SELECT * FROM events;",
        function (error, result) {
            if(error) {
                response(error, null)
            } else {
                    let events = {};
                    Object.values(JSON.parse(JSON.stringify(result))).forEach((item) => {
                        let event = item.id
                        let title = item.title;
                        let startdate = item.eventsdate;
                        let enddate = item.enddate;
    
                        events = Object.assign({}, events, {[event]: [title, startdate,enddate]});
                    })
    
                    //request(null, events);
                    console.log("events: ", result);
                    response(null,result)
            }
    });
}

Event.create = (newEvent, result) => {
    sql.query("INSERT INTO events SET ?", newEvent, (error, res) => {
      if (error) {
        console.log("error: ", error);
        result(error, null);
        return;
      }
  
      console.log("created event: ", { id: res.id, ...newEvent });
      result(null, { id: res.id, ...newEvent });
    });
  };
module.exports = Event;