const sql = require("./createConnection");

class Data {
    /*TODO: specify column*/  

    static getall(/*category,*/users,sports,response) {
        /* zwischen count und sum unterscheiden */
        //sql.query("SELECT  sum(duration) as amount, month(startedAt) as month, year(startedAt) FROM activity WHERE sport = IFNULL(?,sport) GROUP BY year(startedAt), month(startedAt)",[sports], 
        sql.query("SELECT  sum(duration) as amount, month(startedAt) as month, year(startedAt) FROM activity WHERE sport = IFNULL(?,sport) AND user = IFNULL(?,user) GROUP BY year(startedAt), month(startedAt)",[sports,users],  
                function (error, results) {
                    if (error) {
                        response(error, null);
                    } else {
                        response(null, results);
                    }
                });
    }


    static getdurationpermonth() {
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
