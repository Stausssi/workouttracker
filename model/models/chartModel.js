const sql = require("../createConnection");

const Chart = function (chart) { //chart constructor
    this.name= chart.name,
    this.type= chart.type,
    this.category= chart.category,
    this.fill= chart.fill,
    this.param_sport= chart.param_sport,
    this.year= chart.year,
    this.user= chart.user,
    this.sqlfunc= chart.sqlfunc
}

Chart.getAll = (user, response) => {     //get all events
    sql.query("SELECT * FROM charts where user = ?", [user],
        function (error, results) {
            if (error) {
                response(error, null)
            } else {
                response(null, results)
            }
        });
}

Chart.create = (newChart, response) => {    //insert new chart into db   
    sql.query("INSERT INTO charts SET ?", [newChart], (error, results) => {
        if (error) {
            response(error, false);
        } else {
            response(null, true);
        }
    });
}

Chart.remove = (name, user, result) => {     //remove chart depending on unique name as identifier
    sql.query("DELETE FROM charts WHERE name = ? AND user = ?", [name, user], (error, res) => {
        if (error) {
            result(error, null);
        } else {
            result(null, true);
        }
    });
};

module.exports = Chart;
