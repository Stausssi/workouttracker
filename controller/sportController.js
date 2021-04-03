const { request } = require('express');
const Sport = require("../model/sportModel");

exports.getAll = (req, res) => {
    Sport.getAll(function (error, sports) {
        if (error) {
            console.log(error);
            res.status(500).send({message: "Internal server error!"});
        } else {
            res.status(200).send({body: JSON.stringify(sports)});
        }
    });
}