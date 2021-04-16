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
    let user,sport = null
    if(request.query.user)
    {
    user = request.query.user
    }
    sport = request.query.sport
    //Object.keys(req.query.user)
   if(request.query.sport)
    {
       user=request.query.sport
    }
        //users=users.toString()
        //sports=sports.toString()
    Data.getall(user,sport,(error, data) => {
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