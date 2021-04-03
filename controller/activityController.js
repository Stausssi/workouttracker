const { request } = require('express');
const Activity = require("../model/activityModel");

exports.add = (req, res) => {
    Activity.add(function (error, isAdded) {
        if (error) {
            console.log(error);
            res.status(500).send({message: "Internal server error!"});
        } else {
            res.status(200).send({message: "Hello World!"});
        }
    });
}