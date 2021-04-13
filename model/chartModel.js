const sql = require("./createConnection");

const Chart = function(chart) {
}

Chart.getAll = (response) => {
    sql.query("SELECT * FROM charts;",
        function (error, results) {
            if(error) {
                response(error, null)
            } else {
                response(null,results)
            }
    });
}


module.exports = Chart;