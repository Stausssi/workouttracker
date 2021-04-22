const { request } = require('express');
const Chart = require("../model/models/chartModel");
const Data = require("../model/models/dataModel");

exports.findAll = (request, response) => {
    Chart.getAll((error, charts) => {
        if (error) {
            console.log(error);
            response.status(500).send({message: "Internal server error!"});
        } else{
            response.status(200).send({body: JSON.stringify(charts)});
        } 
      });
};

/* Get Data: check if value for user or sport was set and make call to DB depending on it
    Set params into url
*/

exports.getdataset = (request,response) => {
    let year,sport,category = null
    sport = request.query.sport
    category=request.query.category
    year=request.query.year

    Data.getall(category,sport,year,(error, data) => {
        if (error) {
            console.log(error);
            response.status(500).send({message: "Internal server error!" + error});
        } else{
            response.status(200).send({body: JSON.stringify(data)});
        } 
      });
};    


exports.create = (request, response) => {
    if (!request.body) {
        return response.status(400).send({
          message: "Content can not be empty!"
        });
      }
    else {
        const chart = new Chart({
            name: request.body.name,
            type: request.body.type,
            category: request.body.category,
            fill: request.body.fill,
            param_sport: request.body.param_sport,
            year:request.body.year
          });
    Chart.create(chart,(error, added) => {
        if (error) {
            console.log(error);
            return response.status(500).send({message: "Internal server error!" + error});
        } else{
            if (added) {
                response.status(200).send({message: "Chart added!"});
            }
            else {
                response.status(500).send({message: "An error occured while addind new chart"});
            }
        } 
    });
}
};

exports.remove = (request, response) => {
    const chartid = request.body.id
    if (!chartid) {
      response.status(400).send({
        message: "Bad Request: ID can not be empty!"
      });
    }
    else {
      Chart.remove(chartid, (error, data) => {
        if (error) {
          response.status(500).send({ message: "Internal server error!" });
        } else {
          response.status(200).send({ message: "Event was successfully deleted!" });
  
        }
      })
  
    }
  };