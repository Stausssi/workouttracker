//get connection to database
const sql = require('../createConnection');
const mysql = require('mysql');

//constructor for user model

const User = function (user) {
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
            console.log("created user: ", {newUser});
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
    ], function (error, results) {
        if (error) {
            //if an error occurs, return: User already exists
            user_exists(error, true);
        } else {
            if (typeof (results[0]) == "undefined") {
                //results are empty
                console.log("Signup: User " + newUser.username + " / " + newUser.email + " does not exist");
                user_exists(null, false);
            } else {
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
    ], function (error, results) {
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
    ], function (error, results) {
        if (error) {
            //if an error occurs, return null
            result(null);
        } else {
            if (typeof (results[0]) == "undefined") {
                //results are empty
                result(null);
            } else {
                //a user with the corresponding username/ email was found!
                result(results[0]);
            }
        }
    });
}

User.selectProfileData = (req, profileData) => {
    sql.query("SELECT firstname, lastname, date, weight, email FROM user WHERE `username`=?;", [
        req.params.user
    ], function (error, rows, fields) {
        if (error) {
            profileData(error, "{}");
        } else {
            profileData(null, JSON.stringify(rows));
        }
    });
}

User.selectAllProfileDataForEmail = (username, profileData) => {
    sql.query("SELECT firstname, lastname, username, email, confirmationToken FROM user WHERE `username`=?;", [
        username
    ], function (error, rows, fields) {
        if (error) {
            profileData(error, "{}");
        } else {
            profileData(null, rows);
        }
    });
}

User.updateProfileInDB = (req, confirmationToken, resMessage) => {
    let sqlreq = "UPDATE user SET ";
    if (req.body.firstname || req.body.lastname || req.body.date || req.body.weight || req.body.email) {
        if (req.body.firstname) sqlreq += "firstname=" + mysql.escape(req.body.firstname, true) + ", ";
        if (req.body.lastname) sqlreq += "lastname=" + mysql.escape(req.body.lastname, true) + ", ";
        if (req.body.date) sqlreq += "date=" + mysql.escape(req.body.date, true) + ", ";       //date insted of age
        if (req.body.weight) sqlreq += "weight=" + mysql.escape(req.body.weight, true) + ", ";
        if (req.body.email) sqlreq += "email=" + mysql.escape(req.body.email, true) + ", emailVerify=false, confirmationToken='" + confirmationToken + "'";
        sqlreq += "WHERE `username`=" + mysql.escape(req.username, true) + ";";
        sqlreq = sqlreq.replace(", WHERE", " WHERE");

        sql.query(sqlreq, function (error, rows, fields) {
            if (error) {
                resMessage(error, '');
            } else {
                resMessage(null, 'PUT resived!')
            }
        });
    } else {
        resMessage(null, 'PUT is empty!');
    }
}

// Find a username containing a given term
User.find = (user, foundUsers) => {
    sql.query("SELECT username FROM user WHERE LOCATE(?, username)>0 LIMIT 5;",
        [user],
        (error, result) => foundUsers(error, result)
    );
}

// Follow a user
User.follow = (follower, followed, success) => {
    sql.query("INSERT INTO following VALUES (?, ?, false)",
        [follower, followed],
        (error) => success(error)
    );
}

// Unfollow a user
User.unfollow = (follower, followed, success) => {
    sql.query("DELETE FROM following WHERE follower = ? AND followed = ?",
        [follower, followed],
        (error) => success(error)
    );
}

// Block a user
User.block = (username, toBeBlocked, isFollowing, success) => {
    // Update entry if blocked user is already following
    if (isFollowing) {
        sql.query("UPDATE following SET blocked = true WHERE follower = ? AND followed = ?",
            [toBeBlocked, username],
            (error) => success(error)
        );
    } else {
        // Create a new entry in the database
        sql.query("INSERT INTO following VALUES (?, ?, true)",
            [toBeBlocked, username],
            (error) => success(error)
        );
    }
}

// Unblock a user
User.unblock = (username, unblocked, success) => {
    sql.query("UPDATE following SET blocked = 0 WHERE follower = ? AND followed = ?",
        [unblocked, username],
        (error) => success(error)
    );
}

// Get the relationship of two given users
User.getRelationship = (follower, followed, relationship) => {
    // Determine whether the follower is blocked by followed
    sql.query("SELECT blocked FROM following WHERE follower = ? AND followed = ?",
        [follower, followed],
        function (error, result1) {
            if (error) {
                relationship(error, false, false, false, false);
            } else {
                // Determine whether the followed is blocked by the follower
                sql.query("SELECT blocked FROM following WHERE followed = ? AND follower = ?", [follower, followed],
                    function (error, result2) {
                        let isFollowing = result1.length > 0;
                        let isFollowed = result2.length > 0;
                        let isBlocked = isFollowing ? Boolean(result1[0].blocked) : false;
                        let hasBlocked = isFollowed ? Boolean(result2[0].blocked) : false;

                        relationship(error, isFollowing, isFollowed, isBlocked, hasBlocked);
                    }
                );
            }
        }
    );
}

module.exports = User;