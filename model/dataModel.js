const sql = require("./createConnection");

class Data {
    /**/
    static all() {
        /* Alle Funktionen unten zusammnefassen */
        /*Attribute als Variable, durch switch case bestimmen*/
        /* zwischen count und sum unterscheiden */
    }

    static all
    static getdurationpermonth(response /*sport,user*/) {
        /* Where user condition hinzufügen. If null: Wert ignorieren (User benachrichtigen) */
        sql.query("SELECT  sum(duration) as amount, month(startedAt) as month, year(startedAt) FROM activity GROUP BY year(startedAt), month(startedAt)",
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
        sql.query("SELECT  sum(effort) as amount, month(startedAt) as month, year(startedAt) FROM activity GROUP BY year(startedAt), month(startedAt)");
        /* Sport ausschließen, die kein distance haben */
    }
    static getamountforsportpermonth() {
        sql.query("SELECT  count(sport) as amount, month(startedAt) as month, year(startedAt) FROM activity GROUP BY year(startedAt), month(startedAt)");
        /* Summe, wie oft ein Sport in ein Monat ausgeführt wurde */
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
