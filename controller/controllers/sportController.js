const { request } = require('express');
const Sport = require("../../model/models/sportModel");

exports.getAll = (req, res) => {
    Sport.getAll(function (error, sports) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.status(200).send({body: JSON.stringify(sports)});
        }
    });
}