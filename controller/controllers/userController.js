const User = require('../../model/models/userModel');
const jwt = require("jsonwebtoken");
const config = require("../utilities/mail/emailConfirmation.config");
const bcrypt = require("bcryptjs");
const mail = require("../utilities/mail/confirmationEmail");
const tokenGeneration = require("../utilities/authentication/AccessTokenSecret.config");
const {isParamMissing, basicSuccessErrorHandling} = require("../utilities/misc");
const {validateName,validateEmail,validateUsername,validatePassword} = require("../utilities/RegexValidator");

//creates a new user if the email/username doesn't already exist
exports.signup = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let date = req.body.date;
    let weight = req.body.weight;
    let email = req.body.email;


    if (isParamMissing([req.body, username, password, firstname, lastname, date, weight, email])) {
        res.sendStatus(400);
    } else {

        // validate firstname, lastname, username, email, password
        const firstBool = validateEmail(email) && validatePassword(password) && validateUsername(username);
        const secondBool = validateName(firstname) && validateName(lastname);

        if(!(firstBool && secondBool)){
            res.sendStatus(400);
            return;
        }

        //create a user object
        const newUser = new User({
            username: username,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)), // hash password with bcrypt
            firstname: firstname,
            lastname: lastname,
            date: date,
            weight: weight,
            email: email,
            emailVerify: 0,
            confirmationToken: ''
        });

        //check if the user already exists in the database: Attention: async !!!
        User.exists(newUser, function (err, exists) {
            if (err) {
                // Internal Server Error, could not check if user already exists
                console.log(err);
                res.sendStatus(500);
            } else {
                // no error occurred

                if (exists) {
                    res.status(200).send({
                        message: "user exists"
                    });
                } else {
                    //user does not exist in the database
                    //save user to the database

                    // create confirmation token for user (jwt) which will be integrated into a confirmation
                    // link. It is unique because it uses the email of the user as body

                    newUser.confirmationToken = jwt.sign({email: newUser.email}, config.confirmSecret);

                    User.create(newUser, function (err, status) {
                        if (err) {
                            // Internal Server Error, user could not be saved to db
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            // user was created in database
                            //send confirmation email

                            if (!status) {
                                res.status(500).send({
                                    message: "user could not be created"
                                });
                            } else {
                                res.sendStatus(201);

                                //send confirmation email to user with generated confirmationToken
                                mail.sendConfirmationEmail(newUser);
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

    if (isParamMissing([password, emailOrUsername]) || password.length < 5) {
        res.sendStatus(400);
    } else {
        //check if available --> Get user/email from database
        User.getUserByUsernameOrEmail(emailOrUsername, (result) => {
            if (result == null) {
                //no user found (HTTP CODE: 401 - UNAUTHORIZED)
                res.sendStatus(401);
            } else {
                // user found
                //compare password to database hash
                if (bcrypt.compareSync(password, result.password)) {
                    //password matches database hash (HTTP CODE: 200 - OK)
                    //generate JWT for user with content: username ...

                    const accessToken = jwt.sign({username: result.username}, tokenGeneration.AccessTokenSecret);
                    //send access token back to user
                    res.status(200).send({token: accessToken});
                } else {
                    //passwords do not match (HTTP CODE: 401 - UNAUTHORIZED)
                    res.sendStatus(401);
                }
            }
        });
    }
};

//check if a confirmation token (when a the link of a confirmation email is clicked) 
//is valid and update the "emailVerify" attribute, to activate the users account
exports.verifyEmail = (req, res) => {
    const token = req.params.hash;

    if (isParamMissing([token])) {
        res.sendStatus(400);
    } else {
        User.verifyToken(token);
    }
}

//get data to profile with the username
exports.getInformation = (req, res) => {
    User.selectProfileData(req, function (error, profileData) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            if (profileData.length > 0) {
                res.status(200).send(profileData);
            } else {
                res.sendStatus(404);
            }
        }
    });
}

// update profile with new data
exports.updateInformation = (req, res) => {
    let newMail = false;
    let confirmationToken = "";
    if (req.body.email) {
        newMail = true;
        confirmationToken = jwt.sign({email: req.body.email}, config.confirmSecret);
    }
    User.updateProfileInDB(req, confirmationToken, function (error, resMessage) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            if (newMail) {
                //select all data to send a new confirmation mail if the mail was changed
                User.selectAllProfileDataForEmail(req.username, function (error, profileData) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(500);
                    } else {
                        mail.sendConfirmationEmail(profileData[0]);
                        res.status(200).send(resMessage);
                    }
                });
            } else {
                res.status(200).send(resMessage);
            }
        }
    });
}

// Search for a given user in the database
exports.search = (req, res) => {
    const query = req.query.query;

    if (isParamMissing([query])) {
        res.sendStatus(400);
    } else {
        User.find(query, (error, foundUsers) => {
            if (error) {
                console.log(error);
                res.sendStatus(500);
            } else {
                let successful = foundUsers.length > 0;
                let users = [];
                for (let index in foundUsers) {
                    if (foundUsers.hasOwnProperty(index)) {
                        users.push(foundUsers[index].username);
                    }
                }

                res.status(200).send({
                    userFound: successful,
                    users: JSON.stringify(users)
                });
            }
        });
    }
}

// Follow a specific user
exports.follow = (req, res) => {
    let username = req.username;
    let followed = req.body.followed;

    if (isParamMissing([username, followed])) {
        res.sendStatus(400);
    } else {
        User.follow(username, followed, (error) => basicSuccessErrorHandling(error, res, 204))
    }
}

// Unfollow a specific user
exports.unfollow = (req, res) => {
    let username = req.username;
    let unfollowed = req.body.unfollowed;

    if (isParamMissing([username, unfollowed])) {
        res.sendStatus(400);
    } else {
        User.unfollow(username, unfollowed, (error) => basicSuccessErrorHandling(error, res, 204));
    }
}

// Block a specific user
exports.block = (req, res) => {
    let user = req.username;
    let toBeBlocked = req.body.toBeBlocked;

    if (isParamMissing([user, toBeBlocked])) {
        res.sendStatus(400);
    } else {
        // Check whether the toBeBlocked user is already following the other user
        User.getRelationship(toBeBlocked, user, (error, isFollowing, isFollowed, isBlocked) => {
            if (error) {
                console.log(error);
                res.sendStatus(500);
            } else {
                if (!isBlocked) {
                    User.block(user, toBeBlocked, isFollowing, (error) => basicSuccessErrorHandling(error, res, 204));
                } else {
                    res.sendStatus(204);
                }
            }
        });
    }
}

// Unblock a specific user
exports.unblock = (req, res) => {
    let user = req.username;
    let unblocked = req.body.unblocked;

    if (isParamMissing([user, unblocked])) {
        res.sendStatus(400);
    } else {
        User.unblock(user, unblocked, (error) => basicSuccessErrorHandling(error, res, 204));
    }
}

// Get the relationship (following and blocked) of two users
exports.getRelationship = (req, res) => {
    let follower = req.username;
    let followed = req.query.user;

    if (isParamMissing([follower, followed])) {
        res.sendStatus(400);
    } else {
        User.getRelationship(follower, followed, (error, isFollowing, isFollowed, isBlocked, hasBlocked) => {
            if (error) {
                console.log(error);
                res.sendStatus(500);
            } else {
                res.status(200).send({
                    following: isFollowing,
                    followed: isFollowed,
                    blocked: isBlocked,
                    hasBlocked: hasBlocked
                });
            }
        });
    }
}

