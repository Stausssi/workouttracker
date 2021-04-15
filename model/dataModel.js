const sql = require("./createConnection");

class Data {
    /*TODO: speicify column*/

    buildConditions(sport,user) {
        var params = [];
        var values = [];
        var conditionsStr;
      
        if (typeof sport !== 'undefined'  &&  sport !==null) {
          conditions.push("sport = ?");
          values.push(sport);
        }
      
        if (typeof user !== 'undefined') {
          conditions.push("user = ?");
          values.push(user);
        }
//          var sql = 'SELECT * FROM table WHERE ' + conditions.where;
         
        connection.query(sql, params, (error, results, fields) => {
            // handle results here...
          }
        );
      };
      

    static getspecificsportanduser(users,sports,response) {
        /* Alle Funktionen unten zusammnefassen */
        /*Attribute als Variable, durch switch case bestimmen*/
        /* zwischen count und sum unterscheiden */
        //users=users.toString()
        //sports=sports.toString()
               // sql.query("SELECT SUM(duration) AS amount FROM activity WHERE sport = COALESCE(?,sport) AND user = COALESCE(?, user)", [sports, users],
               sql.query("SELECT  sum(duration) as amount, month(startedAt) as month, year(startedAt) FROM activity WHERE sport = ? GROUP BY year(startedAt), month(startedAt)",[sports],             
                function (error, results) {
                    if (error) {
                        response(error, null);
                    } else {
                        response(null, results);
                    }
                });
    }

    static getspeicificsports(sport,response) {
        sql.query("SELECT  sum(duration) as amount, month(startedAt) as month, year(startedAt) FROM activity GROUP BY year(startedAt), month(startedAt) WHERE sport = ?",[sport],
        function (error, results) {
            if (error) {
                response(error, null);
            } else {
                response(null, results);
            }
        });
    };

    static getspeicifcuser(user,response) {
        sql.query("SELECT  sum(duration) as amount, month(startedAt) as month, year(startedAt) FROM activity GROUP BY year(startedAt), month(startedAt) WHERE sport = ?",[sport],
        function (error, results) {
            if (error) {
                response(error, null);
            } else {
                response(null, results);
            }
        });
    }

    static getall(response) {
        sql.query("SELECT  sum(duration) as amount, month(startedAt) as month, year(startedAt) FROM activity GROUP BY year(startedAt), month(startedAt)",
        function (error, results) {
            if (error) {
                response(error, null);
            } else {
                response(null, results);
            }
        });
    }


    static getdurationpermonth(response /*sport,user*/) {
        /* Where user condition hinzufügen. If null: Wert ignorieren (User benachrichtigen) */
        sql.query("SELECT  sum(duration) as amount, month(startedAt) as month, year(startedAt) FROM activity GROUP BY year(startedAt), month(startedAt)",
        //sql.query(""SELECT SUM(duration) AS amount FROM activity WHERE sport = COALESCE(?,sport) AND user = COALESCE(?, user)", [sport, user]")
            function (error, results) {
                if (error) {
                    response(error, null);
                } else {
                    response(null, results);
                }
            });

        /*  if (sport=all)
        {
            if(user)
            {
                sql.query("SELECT  sum(duration) as amount, month(timestamp) as month FROM activity WHERE user=? GROUP BY month(timestamp)",user)
            }
            else {
                sql.query("SELECT  sum(duration) as amount, month(timestamp) as month FROM activity GROUP BY month(timestamp)")
            }
        }else{
            //Nach sport filtern
        }*/
    }
    static getdistancepermonth() {
    }
    static getamountforsportpermonth() {
    }
    static getaveragespeedpermonth() {
    }
    static getaverageheartratepermonth() {
    }
    static getaltitudedifferencepermonth() {
    }
    static geteffortpermonth() {
    }
}










module.exports = Data;
