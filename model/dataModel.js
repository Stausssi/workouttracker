const sql = require("./createConnection");

const Data = function(data) {
}

Data.all = () => {
    /* Alle Funktionen unten zusammnefassen */
    /*Attribute als Variable, durch switch case bestimmen*/
}

Data.getdurationpermonth = (/*sport,user*/) => {
       /* Where user condition hinzufügen. If null: Wert ignorieren (User benachrichtigen) */
       sql.query("SELECT  sum(duration) as amount, month(startedAt) as month, year(startedAt) FROM activity GROUP BY year(startedAt), month(startedAt)")
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

Data.getdistancepermonth = () => {
    sql.query("SELECT  sum(effort) as amount, month(startedAt) as month, year(startedAt) FROM activity GROUP BY year(startedAt), month(startedAt)")
    /* Sport ausschließen, die kein distance haben */
}

Data.getamountforsportpermonth = () => {
    sql.query("SELECT  count(sport) as amount, month(startedAt) as month, year(startedAt) FROM activity GROUP BY year(startedAt), month(startedAt)")
    /* Summe, wie oft ein Sport in ein Monat ausgeführt wurde */
}

Data.getaveragespeedpermonth = () => {
}

Data.getaverageheartratepermonth = () => {
}

Data.getaltitudedifferencepermonth = () => {
}

Data.geteffortpermonth = () => {
}


module.exports = Data;
