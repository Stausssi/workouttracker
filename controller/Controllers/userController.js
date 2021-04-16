const {request} = require('express');
const User = require('../../model/userModel');

//create a new user
exports.signup = (req, res) => {
    //validate request --> add more checks
    console.log(req.body);
    if (!req.body && !req.body.firstname && !req.body.lastname && !req.body.email && !req.body.password) {
        res.status(400).send({message: "bad request"});
    } else {

        //create a user object
        const newuser = new User({
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            age: req.body.age,
            weight: req.body.weight,
            email: req.body.email,
            emailVerify: 0
        });

        //check if the user already exists in the database: Attention: async !!!
        User.exists(newuser, function (err, exists) {
            if (err) {
                // Internal Server Error, could not check if user already exists
                console.log(err);
                res.status(500).send({message: "internal server error"});
            } else {
                // no error occured

                if (exists) {
                    res.status(200).send({
                        message: "user exists"
                    });
                } else {
                    //user does not exist in the database
                    //save user to the database

                    User.create(newuser, function (err, status) {
                        if (err) {
                            // Internal Server Error, user could not be saved to db
                            console.log(err);
                            res.status(500).send({message: "internal server error"});
                        } else {
                            // user was created
                            if (!status) {
                                res.status(500).send({
                                    message: "user could not be created"
                                });
                            } else {
                                res.status(201).send({
                                    message: "user was created"
                                });

                                //
                            }
                        }
                    });
                }
            }
        });
    }
}

exports.login = (username, email, password) => {

};

exports.verifyEmail = () => {


};

exports.search = (req, res) => {
    const query = req.query.query;
    if (!query) {
        res.status(400).send({message: "Bad Request"});
    } else {
        console.log(query);
        // TODO: Database query --> LIKE Statement
        res.status(200).send({
            body: JSON.stringify({
                message: "users " + query
            })
        });
    }
}
