const { request } = require('express');
const Chart = require("../model/chartModel");
const Data = require("../model/dataModel");

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
            response.status(500).send({message: "Internal server error!" + error});
        } else{
            response.send(data);
        } 
      });
};

exports.create = (request, response) => {
   /* Chart.create((error, data) => {
        if (error) {
            console.log(error);
            response.status(500).send({message: "Internal server error!" + error});
        } else{
            response.send(data);
        } 
      });*/
};