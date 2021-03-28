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
    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
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
//returns 1 if user exist and 0 if user doesn´t
User.exists = (newUser) => {
    sql.query("SELECT * FROM users WHERE username = :username OR email = :email", {
        email: newUser.email,
        username: newUser.username
    }, function(error, results){
        if(results[0]){
        //!!!!!!!!!!!!!!!!!!!!!!!!! results empty
            console.log("User " + newUser.username + " / " + newUser.email + "already exists");
            return(1);
        }else{
            console.log("User " + newUser.username + " / " + newUser.email + "does not exist");
            return(0);
        }
    });
    // add errorHandling
};

module.exports = User;