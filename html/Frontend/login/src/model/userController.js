const { request } = require('express');
const User = require('./usermodel');

//create a new user
exports.signup = (req, res) => {
    //validate request --> add more checks
    console.log(req.body);
    if(!req.body && !req.body.firstname && !req.body.lastname && !req.body.email && !req.body.password){
        res.status(400).send({
            message: "bad request"
        });
    } else {

        //create a user object
        const newuser = new User({
            username : req.body.username,
            password : req.body.password,
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            age : req.body.age,
            weight : req.body.weight,
            email : req.body.email,
            emailVerify : 0 
        });

        //check if the user already exists in the database
        if(User.exists(newuser)){
            res.status(400).send({
                message: "user exists"
            });
        } else {
            //user does not exist in the database
            //save user to the database

            const status = User.create(newuser);
            if(!status){
                res.status(500).send({
                    message: "user could not be saved in the database"
                });
            } else {
                res.status(201).send({
                    message: "user was created"
                });
            }

        }
    }   
}