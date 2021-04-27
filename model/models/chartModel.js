const sql = require("../createConnection");

const Chart = function(chart) {
    this.name = chart.name
    this.type = chart.type
    this.category = chart.category
    this.fill = chart.fill
    this.param_sport = chart.param_sport
    this.year=chart.year
}

Chart.getAll = (user,response) => {
    sql.query("SELECT * FROM charts;",
        function (error, results) {
            if (error) {
                console.log("error: ", error);
                response(error, null)
            } else {
                response(null, results)
            }
        });
}

Chart.create = (newChart, response) => {
    sql.query("INSERT INTO charts SET ?", newChart, (error, results) => {
        if (error) {
            console.log("There was an error during inserting new chart: ", error);
            response(error, false);
        }
        else {
            response(null, true);
        }
    });
}

Chart.remove = (name,user, result) => {
    sql.query("DELETE FROM charts WHERE name = ?", name, (error, res) => {
        if (error) {
            console.log("error: ", error);
            result(error, null);
        }
        else {
            result(null, true);
        }
    });
};



module.exports = Chart;
