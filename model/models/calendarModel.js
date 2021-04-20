const sql = require("../createConnection");

const Event = function(event) {
    this.title = event.title;
    this.start= event.start;
    this.end = event.end;
    this.allDay = event.allDay;
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
                        let title = item.title
                        let start = item.start
                        let end = item.end
                        let allDay = item.allDay
                        events = Object.assign({}, events, {[event]: [title, start,end,allDay]});
                    })
  
                    console.log("events: ", result);
                    response(null,result)
            }
    });
}


Event.create = (newEvent, result) => {
    sql.query("INSERT INTO events SET ?", newEvent, (error, res) => {
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
    sql.query("DELETE FROM events WHERE id = ?", id, (error, res) => {
               if(error) {
                   console.log("error: ", error);
                   result(error, null);
               }
               else{
             result(null, true);
               }
           }); 
};


/*Event.updateById = function(id, Event, result){
  sql.query("UPDATE Events SET Event = ? WHERE id = ?", [Event.Event, id], function (err, res) {
          if(err) {
              console.log("error: ", err);
                result(null, err);
             }
           else{   
             result(null, res);
                }
            }); 
};
Event.remove = function(id, result){
     sql.query("DELETE FROM Events WHERE id = ?", [id], function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
               
                 result(null, res);
                }
            }); 
};

module.exports = Event;
