const sql = require("../createConnection");

const Chart = function () { //chart constructor
}

Chart.getAll = (user, response) => {     //get all events
    sql.query("SELECT * FROM charts where user = ?", [user],
        function (error, results) {
            if (error) {
                console.log("error: ", error);
                response(error, null)
            } else {
                response(null, results)
            }
        });
}

Chart.create = (newChart, response) => {    //insert new chart into db   
    sql.query("INSERT INTO charts SET ?", [newChart], (error, results) => {
        if (error) {
            console.log("There was an error during inserting new chart: ", error);
            response(error, false);
        } else {
            response(null, true);
        }
    });
}

Chart.remove = (name, user, result) => {     //remove chart depending on unique name as identifier
    sql.query("DELETE FROM charts WHERE name = ? AND user = ?", [name, user], (error, res) => {
        if (error) {
            console.log("error: ", error);
            result(error, null);
        } else {
            result(null, true);
        }
    });
};

module.exports = Chart;
