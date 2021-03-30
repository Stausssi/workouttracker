//get connection to database
const sql = require('./createConnection');

//constructor for user model

const User = function(user) {
    this.username = user.username;
    this.password = user.password;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.age = user.age;
    this.weight = user.weight;
    this.email = user.email;
    this.emailVerify = user.emailVerify;
}

//return 1 if user was created and 0 if user was not created
User.create = (newUser, result) => {
    sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            return(0);
        } else {
            console.log("created user: ", { newUser });
            return(1);
        }
    });
};

//test, if username/email already exist in database
//returns True if user exist and False if user doesn´t
User.exists = (newUser) => {
    user_exists = true;

    newUser.username = "test"; //REMOVE + IMPLEMENT!!!!!!!!!!!!!!

    console.log("New User: " + newUser.username + "|" + newUser.email);
    sql.query("SELECT * FROM user WHERE username = ? OR email = ?", [
        newUser.username,
        newUser.email
    ], function(error, results){
        console.log(results);
        if(error) return;
        if(typeof(results[0]) == undefined){
            //results are empty
            console.log("Signup: User " + newUser.username + " / " + newUser.email + " does not exist");
            user_exists = false;
        }else{
            //a user with the corresponding username/ email was found!
            console.log("Signup: User " + newUser.username + " / " + newUser.email + " does already exist");
            user_exists = true;
        }
    });
    return user_exists;
};

module.exports = User;