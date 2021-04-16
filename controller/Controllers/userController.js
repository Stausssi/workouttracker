const { request } = require('express');
const User = require('../../model/usermodel');
const jwt = require("jsonwebtoken");
const config = require("../mail/emailConfirmation.config");
const bcrypt = require("bcryptjs");
const mail = require("../mail/confirmationEmail");
const tokenGeneration = require("../Authentication/AccessTokenSecret.config");


//creates a new user if the email/username doesn´t already exist
exports.signup = (req, res) => {
    //validate request --> add more checks !!!!!!!!!!!!!!!!!!!!!!!!!!
    console.log(req.body);
    if(!req.body && !req.body.firstname && !req.body.lastname && !req.body.email && !req.body.password && !req.body.username && !req.body.date && !req.body.weight){
        res.status(400).send({message: "bad request"});
    } else {

        //create a user object
        const newuser = new User({
            username : req.body.username,
            password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)), // hash password with bcrypt
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            date : req.body.date,
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
                                res.status(201).send({message: "user created"});

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

exports.login = (req, res) => {
    const password = req.body.password;
    const emailOrUsername = req.body.emailOrUsername;

    if((!emailOrUsername && !password) || password.length < 5){
        res.status(400).send({message: "bad request"});
    } else {
        //check if available --> Get user/email from database
        User.getUserByUsernameOrEmail(emailOrUsername, (result) => {
            if(result == null){
                //no user found (HTTP CODE: 401 - UNAUTHORIZED)
                res.status(401).send({message: "Login failed"});
            }else{
                // user found
                //compare password to database hash
                if(bcrypt.compareSync(password, result.password)){
                    //password matches database hash (HTTP CODE: 200 - OK)
                    //generate JWT for user with content: username ...

                    const accessToken = jwt.sign({ username: result.username }, tokenGeneration.AccessTokenSecret);
                    //send access token back to user
                    res.status(200).send({token: accessToken});
                }else{
                    //passwords do not match (HTTP CODE: 401 - UNAUTHORIZED)
                    res.status(401).send({message: "Login failed"});
                }
            }
        });
    }
};

//check if a confirmation token (when a the link of a confirmation email is clicked) 
//is valid and update the "emailVerify" attribute, to activate the users account
exports.verifyEmail = (req, res) => {
    const token = req.params.hash;
   
    if(!token){
        res.status(400).send({message: "bad request"});
    } else {
        User.verifyToken(token);
    }

};

//This is a controller file, not a model file --> Move