const { request } = require('express');
const Chart = require("../../model/chartModel");
const Data = require("../../model/dataModel");

exports.findAll = (request, response) => {
  let username = request.username;
    Chart.getAll((error, charts) => {
        if (error) {
            console.log(error);
            response.sendStatus(500)
        } else{
            response.status(200).send({body: JSON.stringify(charts)});
        } 
      });
};

/* Get Data: check if value for user or sport was set and make call to DB depending on it
    Set params into url
*/

exports.getdataset = (request,response) => {
    let username = request.username;
    let year,sport,category = null
    sport = request.query.sport
    category=request.query.category
    year=request.query.year

    Data.getall(category,sport,year,(error, data) => {
        if (error) {
            console.log(error);
            response.sendStatus(500)
        } else{
            response.status(200).send({body: JSON.stringify(data)});
        } 
      });
};    


exports.create = (request, response) => {
    if (!request.body) {
        response.sendStatus(400)
      }
    else {
      let username = request.username;
        const chart = new Chart({
            name: request.body.name,
            type: request.body.type,
            category: request.body.category,
            fill: request.body.fill,
            param_sport: request.body.param_sport,
            year:request.body.year
            //user:request.username
          });
    Chart.create(chart,(error, added) => {
        if (error) {
            console.log(error);
            return response.sendStatus(500)
        } else{
            if (added) {
                response.sendStatus(200)
            }
            else {
                response.sendStatus(500)
            }
        } 
    });
}
};

exports.remove = (request, response) => {
    const chartid = request.body.chartid
    if (!chartid) {
      response.sendStatus(400)
    }
    else {
      let username = request.username;
      Chart.remove(chartid, (error, data) => {
        if (error) {
          response.sendStatus(500)
        } else {
          response.status(200)
  
        }
      })
  
    }
  };