const connection = require("../createConnection");

const GoogleFit = function (profile) {
}

GoogleFit.insertGoogleFItActivityInDB = (data, profileData) => {
    connection.query("SELECT `activity_id` FROM `activity` WHERE `user`=? AND `duration`=? AND `sport`=? AND `startedAt`=? AND `distance`=?;" , [
        data.username,
        data.duration,
        data.sport,
        data.starttime,
        data.distance
    ], function(error, rows, fields){//AND `distance`='" + res.data.bucket[0].dataset[0].point[0].value[0].fpVal + "'
        console.log(error)
        console.log(rows)
        console.log("SELECT `activity_id` FROM `activity` WHERE `user`='"+data.username+"' AND `duration`='"+data.duration+"' AND `sport`='"+data.sport+"' AND `startedAt`='"+data.starttime+"';")
        if(error) profileData(error);
        else {
            //hier ist das ergebnis in rows
            if(rows.length == 0) {
                connection.query("INSERT INTO `activity` (`activity_id`, `user`, `addedAt`, `startedAt`, `sport`, `duration`, `pace`, `distance`, `averageHeartRate`) VALUES (NULL, ?, current_timestamp(), ?, ?, ?, ?, ?, ?)" , [
                    data.username,
                    data.starttime,
                    data.sport,
                    data.duration,
                    data.avarageSpeed,
                    data.distance,
                    data.averageHeartRate
                ], function(error, rows, fields){
                    console.log(error);
                    if(error) profileData(error);
                });
            }
        }
    });
}

module.exports = GoogleFit;