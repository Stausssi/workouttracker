const {request} = require('express');
const Activity = require("../model/activityModel");

exports.add = (req, res) => {
    if (!req.body) {
        res.status(400).send({message: "Bad request"});
    } else {
        Activity.add(req.body, function (error, isAdded) {
            if (error) {
                console.log(error);
                res.status(500).send({message: "Internal server error!"});
            } else {
                if (isAdded) {
                    res.status(201).send({message: "Activity added!"});
                } else {
                    res.status(500).send({message: "Activity wasn't added!"})
                }
            }
        });
    }
}