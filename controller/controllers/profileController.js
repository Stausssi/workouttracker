const Profile = require("../../model/models/profileModel");

//get data to Profile
exports.profilesite = (req, resp) => {
    if(req.username == req.params.user){
        Profile.selectProfileData(req, function (error, profileData) {
            if (error) {
                resp.status(500).send({
                    errno: 2,
                    message: "Internal server error!"
                });
            } else resp.status(200).send(profileData);
        });
    }
    else resp.status(500).send({message: "No acces Permision!"});
}

//update Profile
exports.profileUpdate = (req, resp) => {
    Profile.updateProfileInDB(req, function (error, resMessage) {
        if (error) {
            resp.status(500).send({
                errno: 2,
                message: "Internal server error!"
            });
        } else resp.status(200).send(resMessage);
    });
}