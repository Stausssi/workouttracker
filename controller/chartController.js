const { request } = require('express');
const Chart = require("../model/chartModel");
const Data = require("../model/dataModel");

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

exports.test = (request, response) => {
    Data.getdurationpermonth((error, data) => {
        if (error) {
            console.log(error);
            response.status(500).send({message: "Internal server error!" + error});
        } else{
            response.status(200).send({body: JSON.stringify(data)});
        } 
      });
};

/* Get Data: check if value for user or sport was set and make call to DB depending on it
    Set params into url
*/

exports.getdataset = (request,response) => {
    const user=request.query.user
    const sport=request.query.sport
    Data.getspecificsportanduser(user,sport,(error, data) => {
   //    Data.getall((error,data) =>{
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
        response.status(400).send({
          message: "Content can not be empty!"
        });
      }
    else {
        const chart = new Chart({
            name: request.body.name,
            type: request.body.type,
            dataset: request.body.dataset,
            fill: request.body.fill,
            param_sport: request.body.param_sport,
            param_user: request.body.param_user
          });
    Chart.create(chart,(error, added) => {
        if (error) {
            console.log(error);
            response.status(500).send({message: "Internal server error!" + error});
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