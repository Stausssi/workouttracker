const sql = require("../createConnection");

const Data = () => {
}

//Sum datasets on selected category in selected year for current user
Data.getamount = (category,sports,year,user, response) => {
    sql.query("SELECT  sum(??) as amount, month(startedAt) as month FROM activity WHERE sport = IFNULL(?,sport) AND YEAR(startedAt)=? GROUP BY month(startedAt) ORDER BY month(startedAt)", [category,sports, year],
        function (error, results) {
            if (error) {
                response(error, null);
            } else {
                response(null, results);
            }
        });
}

//Create average for datasets on selected category in selected year for current user
Data.getaverage = (category,sports,year,user, response) => {
    sql.query("SELECT  avg(??) as amount, month(startedAt) as month FROM activity WHERE sport = IFNULL(?,sport) AND YEAR(startedAt)=? GROUP BY month(startedAt) ORDER BY month(startedAt)", [category,sports, year],
        function (error, results) {
            if (error) {
                response(error, null);
            } else {
                response(null, results);
            }
        });
}


module.exports = Data;
