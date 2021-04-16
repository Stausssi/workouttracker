//get connection to database
const sql = require('../createConnection');

//constructor for user model

const User = function(user) {
    this.username = user.username;
    this.password = user.password;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.date = user.date;
    this.weight = user.weight;
    this.email = user.email;
    this.emailVerify = user.emailVerify;
    this.confirmationToken = user.confirmationToken;
}

//status is true if user was created and false if user was not created --> Status
User.create = (newUser, status) => {
    sql.query("INSERT INTO user SET ? ", newUser, (error, result) => {
        if (error) {
            console.log("error: ", error);
            status(error, false);
        } else {
            console.log("created user: ", { newUser });
            status(error, true);
        }
    });
};

//test, if username/email already exist in database
//returns True if user exist and False if user doesn´t
User.exists = (newUser, user_exists) => {
    console.log("New User: " + newUser.username + "|" + newUser.email);
    sql.query("SELECT * FROM user WHERE username = ? OR email = ?", [
        newUser.username,
        newUser.email
    ], function(error, results){
        if(error){
            //if an error occurs, return: User already exists
            user_exists(error, true);
        } else {
            if(typeof(results[0]) == "undefined"){
                //results are empty
                console.log("Signup: User " + newUser.username + " / " + newUser.email + " does not exist");
                user_exists(null, false);
            }else{
                //a user with the corresponding username/ email was found!
                console.log("Signup: User " + newUser.username + " / " + newUser.email + " does already exist");
                user_exists(null, true);
            }
        }
    });
};

User.verifyToken = (token, success) => {

    sql.query("UPDATE user SET emailVerify = 1 WHERE confirmationToken = ?", [
        token
    ], function(error, results){
        console.log(error);
        console.log(results);
    });
}

//returns a user of the database for a given username/email. If noone was found, return null
// the emailVerify field has to be set

User.getUserByUsernameOrEmail = (UsernameOrEmail, result) => {
    sql.query("SELECT * FROM user WHERE emailVerify = 1 AND (username = ? OR email = ?)", [
        UsernameOrEmail,
        UsernameOrEmail
    ], function(error, results){
        if(error){
            //if an error occurs, return null
            result(null);
        } else {
            if(typeof(results[0]) == "undefined"){
                //results are empty
                result(null);
            }else{
                //a user with the corresponding username/ email was found!
                result(results[0]);
            }
        }
    });
}

module.exports = User;