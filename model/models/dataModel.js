const sql = require("../createConnection");

const Data = () => {
}

//Sum datasets on selected category in selected year for current user
Data.getAmount = (category, sports, year, user, response) => {
    sql.query("SELECT  sum(??) as amount, month(startedAt) as month FROM activity WHERE sport = IFNULL(?,sport) AND YEAR(startedAt)=? AND user=? GROUP BY month(startedAt)", [category, sports, year, user],
        function (error, results) {
            if (error) {
                response(error, null);
            } else {
                response(null, results);
            }
        });
}

//get average for datasets on selected category in selected year for current user
Data.getAverage = (category, sports, year, user, response) => {
    sql.query("SELECT  avg(??) as amount, month(startedAt) as month FROM activity WHERE sport = IFNULL(?,sport) AND YEAR(startedAt)=? AND user=? GROUP BY month(startedAt)", [category, sports, year, user],
        function (error, results) {
            if (error) {
                response(error, null);
            } else {
                response(null, results);
            }
        });
}

module.exports = Data;
