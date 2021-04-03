const { request } = require('express');
const User = require('../model/usermodel');
const jwt = require("jsonwebtoken");
const config = require("./mail/emailConfirmation.config");
const bcrypt = require("bcryptjs");
const mail = require("./mail/confirmationEmail")


//creates a new user if the email/username doesn´t already exist
exports.signup = (req, res) => {
    //validate request --> add more checks
    console.log(req.body);
    if(!req.body && !req.body.firstname && !req.body.lastname && !req.body.email && !req.body.password && !req.body.username){
        res.status(400).send({message: "bad request"});
    } else {

        //create a user object
        const newuser = new User({
            username : req.body.username,
            password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)), // hash password with bcrypt
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            age : req.body.age,
            weight : req.body.weight,
            email : req.body.email,
            emailVerify : 0,
            confirmationToken: ''
        });

        //check if the user already exists in the database: Attention: async !!!
        User.exists(newuser, function(err, exists){
            if(err){
                // Internal Server Error, could not check if user already exists
                console.log(err);
                res.status(500).send({message: "internal server error"});
            } else {
                // no error occured

                if(exists){
                    res.status(200).send({
                        message: "user exists"
                    });
                } else {
                    //user does not exist in the database
                    //save user to the database

                    // create confirmation token for user (jwt) which will be integrated into a confirmation
                    // link. It is unique because it uses the email of the user as body

                    newuser.confirmationToken = jwt.sign({email: newuser.email}, config.confirmSecret);
        
                    User.create(newuser, function(err, status){
                        if(err){
                            // Internal Server Error, user could not be saved to db
                            console.log(err);
                            res.status(500).send({message: "internal server error"});
                        } else {
                            // user was created in database
                            //send confirmation email

                            if(!status){
                                res.status(500).send({
                                    message: "user could not be created"
                                });
                            } else {
                                res.status(201).send({
                                    message: "user was created"
                                });

                                //send confirmation email to user with generated confirmationToken
                                mail.sendConfirmationEmail(newuser);
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

//check if a confirmation token is valid an update the "emailVerify" attribute, to activate the user
exports.verifyEmail = (req, res) => {
    const token = req.params.hash;

    if(!token){
        res.status(400).send({message: "bad request"});
    } else {
        User.verifyToken();
    }

};

//This is a controller file, not a modell file --> Move