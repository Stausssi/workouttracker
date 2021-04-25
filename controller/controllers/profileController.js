const Profile = require("../../model/models/profileModel");
const Mail = require("../utilities/mail/confirmationEmail");
const config = require("../utilities/mail/emailConfirmation.config");
const jwt = require("jsonwebtoken");

//get data to Profile
exports.profilesite = (req, resp) => {
    Profile.selectProfileData(req, function (error, profileData) {
        if (error) {
            resp.status(500).send({
                errno: 2,
                message: "Internal server error!"
            });
        } else resp.status(200).send(profileData);
    });
}

//update Profile
exports.profileUpdate = (req, resp) => {
    var newmail = false;
    var confirmationToken = "";
    if(req.body.email){
        newmail = true;
        confirmationToken = jwt.sign({email: req.body.email}, config.confirmSecret);
    }
    Profile.updateProfileInDB(req, confirmationToken, function (error, resMessage) {
        if (error) {
            resp.status(500).send({
                errno: 2,
                message: "Internal server error!"
            });
        } else{
            if(newmail){
                Profile.selectAllProfileDataForEmail(req.username, function (error, profileData) {
                    if (error) {
                        resp.status(500).send({
                            errno: 2,
                            message: "Internal server error!"
                        });
                    } else{
                        console.log(profileData[0].email);

                        Mail.sendConfirmationEmail(profileData[0]);
                        resp.status(200).send(resMessage);
                    }
                });
            }
        }
    });




}