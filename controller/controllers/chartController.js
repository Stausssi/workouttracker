const { request } = require('express');
const Chart = require("../../model/models/chartModel");
const Data = require("../../model/models/dataModel");
const { isParamMissing } = require("../utilities/misc");

//find charts which matched to currently logged user
exports.findAll = (request, response) => {
  let username = request.username;
  if (isParamMissing([username])) {
    request.sendStatus(400)
  }
  else {
    Chart.getAll(username, (error, charts) => {
      if (error) {
        console.log(error);
        response.sendStatus(500)
      } else {
        response.status(200).send({ body: JSON.stringify(charts) });
      }
    });
  }
};

//find datasets for chart
exports.getdataset = (request, response) => {
  let username = request.username;
  let sqlfunc = request.query.sqlfunc
  if (isParamMissing([username, sqlfunc])) {
    request.sendStatus(400)
  }
  else {
    let year, sport, category = null
    sport = request.query.sport
    category = request.query.category
    year = request.query.year
    if (sqlfunc === "sum") {    //get datasets with sql funcrtion sum 
      Data.getamount(category, sport, year, username,(error, data) => {
        if (error) {
          console.log(error);
          response.sendStatus(500)
        } else {
          response.status(200).send({ body: JSON.stringify(data) });
        }
      });
    }
    else if (sqlfunc === "avg") { //get datasets with sql funcrtion avg 
      Data.getaverage  (category, sport, year, username,(error, data) => {
        if (error) {
          console.log(error);
          response.sendStatus(500)
        } else {
          response.status(200).send({ body: JSON.stringify(data) });
        }
      });
    }
    else {                //send bad request error if neither sum nor avg is set
      response.sendStatus(400)
    }
  }
};

//create chart 
exports.create = (request, response) => {
  let username = request.username;
  if (!request.body || isParamMissing([username])) {
    response.sendStatus(400)
  }
  else {
    let sport = null
    if (request.body.param_sport && !request.body.param_sport === "") {
      sport = request.body.param_sport
    }
    const chart = new Chart({   //chart constructor
      name: request.body.name,
      type: request.body.type,
      category: request.body.category,
      fill: request.body.fill,
      param_sport: sport,
      year: request.body.year,
      user: request.username,
      sqlfunc: request.body.sqlfunc
    });
    Chart.create(chart, (error, added) => {
      if (error || !added) {
        response.sendStatus(500)
      } else {
        response.sendStatus(200)
      }
    });
  }
};

//remove chart with name of chart as id
exports.remove = (request, response) => {
  const chartid = request.body.chartid
  let username = request.username;
  if (!request.body || isParamMissing([username, chartid])) {
    response.sendStatus(400)
  }
  else {
    Chart.remove(chartid, username, (error, data) => {
      if (error || !data) {
        response.sendStatus(500)
      } else {
        response.sendStatus(200)
      }
    })
  }
};
