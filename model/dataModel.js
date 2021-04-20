const sql = require("./createConnection");

const Data = () => {
}
/*TODO: specify column*/

Data.getall = (category, users, sports, response) => {
    /* zwischen count und sum unterscheiden */
    sql.query("SELECT  sum(duration) as amount, month(startedAt) as month, year(startedAt) FROM activity WHERE sport = IFNULL(?,sport) AND user = IFNULL(?,user) GROUP BY year(startedAt), month(startedAt)", [/*category,*/ sports, users],
        function (error, results) {
            if (error) {
                response(error, null);
            } else {
                response(null, results);
            }
        });
}



/*
    getdurationpermonth() {
    }
    getdistancepermonth() {
    }
    getamountforsportpermonth() {
    }
    getaveragespeedpermonth() {
    }
    getaverageheartratepermonth() {
    }
    getaltitudedifferencepermonth() {
    }
    geteffortpermonth() {
    }*/











module.exports = Data;
