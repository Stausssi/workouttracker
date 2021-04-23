const sql = require("../createConnection");

const Data = () => {
}
/*TODO: specify column*/

Data.getall = (category,sports,year, response) => {
    /* zwischen count und sum unterscheiden */
    sql.query("SELECT  sum(??) as amount, month(startedAt) as month FROM activity WHERE sport = IFNULL(?,sport) AND YEAR(startedAt)=2021 GROUP BY month(startedAt) ORDER BY month(startedAt)", [category,sports, year],
        function (error, results) {
            if (error) {
                response(error, null);
            } else {
                response(null, results);
            }
        });
}


module.exports = Data;
