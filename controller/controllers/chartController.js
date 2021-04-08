const { request } = require('express');
const Chart = require("../model/models/chartModel");
const Data = require("../model/models/dataModel");

exports.findAll = (request, response) => {
    Chart.getAll((error, data) => {
        if (error) {
            console.log(error);
            response.status(500).send({message: "Internal server error!"});
        } else{
            response.send(data);
        } 
      });
};

exports.test = (request, response) => {
    Data.getdurationpermonth((error, data) => {
        if (error) {
            console.log(error);
            response.status(500).send({message: "Internal server error!"});
        } else{
            response.send(data);
        } 
      });
};
