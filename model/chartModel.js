const sql = require("./createConnection");

const Chart = function(chart) {
    this.name=chart.name
    this.type=chart.type
    this.dataset=chart.dataset
    this.fill=chart.fill
    this.param_sport=chart.param_sport
    this.param_user=chart.param_user
      /*  optional: params:   
            user
            sport
    */
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

Chart.create = (newChart,response) => {
    sql.query("INSERT INTO charts SET ?", newChart, (error,results) => {
        if (error) {
            console.log("There was an error during inserting new chart: ", error);
            response(error, false);
          }
          else {      
             response(null, true);
    }
});
}


module.exports = Chart;