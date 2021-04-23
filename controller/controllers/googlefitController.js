const { google } = require('googleapis')
const request = require('request');
const urlParse = require('url-parse');
const queryParser = require('query-string');
const axios = require('axios');
const GoogleFit = require("../../model/models/GoogleFitModel");


exports.getFitURL = (req,res) => {
    const oauth2Client = new google.auth.OAuth2(
        //client id
        "302139597636-dt8i3diuqssqn64sc0to9l79nq0ib748.apps.googleusercontent.com",
        //client secret
        "-go0MpwOnEw3MicUM_S7rOPW",
        //link to redirect to
        "http://localhost:9000/backend/googlefit/activity"
    );
        //generates URL
        const scopes = [ "https://www.googleapis.com/auth/fitness.location.read https://www.googleapis.com/auth/fitness.activity.read profile email " ];
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes,
            state: JSON.stringify({
                callbackURL: req.body.callbackURL,
                userID: req.body.userid,
                username: "MeinUsername" //req.username
            })
        })

        request(url, (err, response, body) => {
            console.log("error: ", err);
            console.log("statusCode: ", response && response.statusCode);
            res.send({ url });
        });
}

exports.insertActivitysFromGoogle = async (req, res) => {
    const queryURL = new urlParse(req.url);
    //get requert ident code for authentification at Google Cloud services from the URL
    const code = queryParser.parse(queryURL.query).code;
    //Get Username from URL
    const username = JSON.parse(queryParser.parse(queryURL.query).state).username;
    const oauth2Client = new google.auth.OAuth2(
        //client id
        "302139597636-dt8i3diuqssqn64sc0to9l79nq0ib748.apps.googleusercontent.com",
        //client secret
        "-go0MpwOnEw3MicUM_S7rOPW",
        //link to redirect to
        "http://localhost:9000/backend/googlefit/activity"
    );

    const tokens = await oauth2Client.getToken(code);

    let sessionArray = [];

    var Now = new Date();
    var Day = Now.getDate();
    var Month = Now.getMonth() +1;
    var Jear = Now.getYear();
    var Hour = Now.getHours();
    var Minutes = Now.getMinutes();
    if (Jear < 1900) {
        Jear += 1900;
    }

    //start and end time to Parse
    const starttimestamp = Jear-1 + "-" + Month + "-" + Day + "T" + Hour + ":" + Minutes + ":00.000Z";
    const endtimestamp = Jear + "-" + Month + "-" + Day + "T" + Hour + ":" + Minutes + ":00.000Z";

    const authstuff = {
        headers: {
            'Authorization': `Bearer ${tokens.tokens.access_token}`,
            'Content-Type': 'application/json;encoding=utf-8'
        }
    }

    var dberror = false;

    axios.get(`https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${starttimestamp}&endTime=${endtimestamp}`, authstuff)//get activitys
        .then(res => {
            sessionArray = res.data.session;

            try {
                for(const session of sessionArray){
                    const body = {
                    "aggregateBy": [{
                        "dataTypeName": "com.google.distance.delta",
                        "dataSourceId": "derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta"
                    }],
                    "bucketByTime": { "durationMillis": 604800000 },//7Days as default max activitys to filter strange activitys
                        "startTimeMillis": session.startTimeMillis,
                        "endTimeMillis": session.endTimeMillis
                    }
                    axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', body, authstuff)//get distance of a timespan
                    .then(res => {
                        try {
                            const duration = (session.endTimeMillis - session.startTimeMillis) / 1000;
                            console.log("activityType:" + session.activityType + " timestamp:" +  session.startTimeMillis + " duration:" + duration);
                            console.log(res.data.bucket[0].dataset[0].point[0].value[0].fpVal);
                            var sport = "Other"; //default Other
                            //maping from google fit https://developers.google.com/fit/rest/v1/reference/activity-types
                            if(session.activityType == 56 || session.activityType == 8 || session.activityType == 57 || session.activityType == 58 || session.activityType == 7 || session.activityType == 93 || session.activityType == 94 || session.activityType == 95 || session.activityType == 116) sport = "Joggen";//jogging
                            else if(session.activityType == 1 || session.activityType == 14 || session.activityType == 15 || session.activityType == 16) sport = "Cycling";//Cycling
                            else if(session.activityType == 82 || session.activityType == 84 || session.activityType == 83) sport = "Swimming";//Swimming
                            else if(session.activityType == 11 || session.activityType == 12 || session.activityType == 27 || session.activityType == 28 || session.activityType == 29 || session.activityType == 34 || session.activityType == 51 || session.activityType == 120 || session.activityType == 89 || session.activityType == 90 || session.activityType == 91) sport = "Ball sports";//Ball sports
                            else if(session.activityType == 24) sport = "Dancing";//Dancing

                            const avarageSpeed = (res.data.bucket[0].dataset[0].point[0].value[0].fpVal / 1000) / (duration / 3600);

                            //darabase insert
                            var insertObj = {
                                username: username,
                                duration: duration,
                                sport: sport,
                                avarageSpeed: avarageSpeed,
                                distance: res.data.bucket[0].dataset[0].point[0].value[0].fpVal
                            };

                            console.log(insertObj);

                            GoogleFit.insertGoogleFItActivityInDB(insertObj, function (error) {
                                if (error) dberror = true;
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    })
                    .catch(err => {
                        console.log("OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!");
                        console.log(err);
                        console.log(tokens.tokens.access_token);
                    });
                }
            } catch (e) {
                console.log(e);
            }
        })
        .catch(err => {
            console.log("OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!");
            console.log(err);
        });
    if (dberror) res.send('<script>alert("Internal server error!"); window.location.href = "http://localhost:3000/"; </script>');
    else res.send('<script>alert("We import your Activitys from the last Year"); window.location.href = "http://localhost:3000/"; </script>');
}