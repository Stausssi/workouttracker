const connection = require("../createConnection");

const GoogleFit = function (profile) {
}

GoogleFit.insertGoogleFItActivityInDB = (data, profileData) => {
    connection.query("SELECT `activity_id` FROM `activity` WHERE `user`=? AND `duration`=? AND `sport`=?;" , [
        data.username,
        data.duration,
        data.sport
    ], function(error, rows, fields){//AND `distance`='" + res.data.bucket[0].dataset[0].point[0].value[0].fpVal + "'
        if(error) profileData(error);
        else {
            //hier ist das ergebnis in rows
            if(rows.length == 0) {
                connection.query("INSERT INTO `activity` (`activity_id`, `user`, `startedAt`, `addedAt`, `sport`, `duration`, `pace`, `distance`) VALUES (NULL, ?, current_timestamp(), current_timestamp(), ?, ?, ?, ?)" , [
                    data.username,
                    data.sport,
                    data.duration,
                    data.avarageSpeed,
                    data.distance
                ], function(error, rows, fields){
                    if(error) profileData(error);
                });
            }
        }
    });
}

module.exports = GoogleFit;