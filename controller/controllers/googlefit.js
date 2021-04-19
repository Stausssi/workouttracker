const express = require('express');
var mysql = require('mysql');
const app = express();
const { google } = require('googleapis')
const request = require('request');
const cors = require('cors');
const urlParse = require('url-parse');
const queryParser = require('query-string');
const axios = require('axios');

app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.get("/getURLTing", (req,res) => {
    const oauth2Client = new google.auth.OAuth2(
        //client id
        "302139597636-dt8i3diuqssqn64sc0to9l79nq0ib748.apps.googleusercontent.com",
        //client secret
        "-go0MpwOnEw3MicUM_S7rOPW",
        //link to redirect to
        "http://localhost:3001/activity"
    );
        const scopes = [ "https://www.googleapis.com/auth/fitness.location.read https://www.googleapis.com/auth/fitness.activity.read profile email " ];
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes,
            state: JSON.stringify({
                callbackURL: req.body.callbackURL,
                userID: req.body.userid
            })
        })

        request(url, (err, response, body) => {
            console.log("error: ", err);
            console.log("statusCode: ", response && response.statusCode);
            res.send({ url });
        });
});

app.get("/activity", async (req, res) => {
    const queryURL = new urlParse(req.url);
    const code = queryParser.parse(queryURL.query).code;
    const oauth2Client = new google.auth.OAuth2(
        //client id
        "302139597636-dt8i3diuqssqn64sc0to9l79nq0ib748.apps.googleusercontent.com",
        //client secret
        "-go0MpwOnEw3MicUM_S7rOPW",
        //link to redirect to
        "http://localhost:3001/activity"
    );

    const tokens = await oauth2Client.getToken(code);
    res.send("HELLO");

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

    const starttimestamp = Jear-1 + "-" + Month + "-" + Day + "T" + Hour + ":" + Minutes + ":00.000Z";
    const endtimestamp = Jear + "-" + Month + "-" + Day + "T" + Hour + ":" + Minutes + ":00.000Z";
    console.log(`https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${starttimestamp}&endTime=${endtimestamp}`)

    const authstuff = {
        headers: {
            'Authorization': `Bearer ${tokens.tokens.access_token}`,
            'Content-Type': 'application/json;encoding=utf-8'
        }
    }

    axios.get(`https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${starttimestamp}&endTime=${endtimestamp}`, authstuff)
        .then(res => {
            sessionArray = res.data.session;
            try {
                for(const session of sessionArray){
                    const body = {
                    "aggregateBy": [{
                        "dataTypeName": "com.google.distance.delta",
                        "dataSourceId": "derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta"
                    }],
                    "bucketByTime": { "durationMillis": 604800000 },
                        "startTimeMillis": session.startTimeMillis,
                        "endTimeMillis": session.endTimeMillis
                    }
                    axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', body, authstuff)
                    .then(res => {
                        try {
                            const duration = session.endTimeMillis - session.startTimeMillis;
                            console.log("activityType:" + session.activityType + " timestamp:" +  session.startTimeMillis + " duration:" + duration);
                            console.log(res.data.bucket[0].dataset[0].point[0].value[0].fpVal);
                            var sport = "something else"; //default something else
                            //maping from google fit https://developers.google.com/fit/rest/v1/reference/activity-types
                            if(session.activityType == 56 || session.activityType == 8 || session.activityType == 57 || session.activityType == 58 || session.activityType == 7 || session.activityType == 93 || session.activityType == 94 || session.activityType == 95 || session.activityType == 116) sport = "Joggen";//jogging
                            if(session.activityType == 1 || session.activityType == 14 || session.activityType == 15 || session.activityType == 16) sport = "Radfahren";//biking
                            if(session.activityType == 82 || session.activityType == 84 || session.activityType == 83) sport = "Schwimmen";//swimming
                            if(session.activityType == 11 || session.activityType == 12 || session.activityType == 27 || session.activityType == 28 || session.activityType == 29 || session.activityType == 34 || session.activityType == 51 || session.activityType == 120 || session.activityType == 89 || session.activityType == 90 || session.activityType == 91) sport = "Ballsport";//ball
                            if(session.activityType == 24) sport = "Tanzen";//dancing
                            //darabase insert
                            var bla = ("SELECT `PrimaryKey` FROM `activity` WHERE `PKUser`='" + 12 + "' AND `duration`='" + duration + "' AND `sport`='" + sport + "';");// AND `distance`='" + res.data.bucket[0].dataset[0].point[0].value[0].fpVal.toFixed(2) + "'
                            connection.query("SELECT `PrimaryKey` FROM `activity` WHERE `PKUser`='" + 12 + "' AND `duration`='" + duration + "' AND `sport`='" + sport + "';" , function(error, rows, fields){//AND `distance`='" + res.data.bucket[0].dataset[0].point[0].value[0].fpVal + "' 
                                if(error) {
                                    console.log(error);
                                }
                                else {
                                    console.log('Successful query');
                                    //hier ist das ergebnis in rows
                                    console.log(rows.length);
                                    if(rows.length == 0) {
                                        console.log(bla);
                                        const avarageSpeed = (res.data.bucket[0].dataset[0].point[0].value[0].fpVal / 1000) / (duration / 3600000);

                                        
                                        connection.query("INSERT INTO `activity` (`PrimaryKey`, `PKUser`, `timestamp`, `sport`, `duration`, `avageSpeed`, `distance`) VALUES (NULL, '" + 12 + "', current_timestamp(), '" + sport + "', '" + duration + "', '" + avarageSpeed + "', '" + res.data.bucket[0].dataset[0].point[0].value[0].fpVal + "')" , function(error, rows, fields){
                                            if(error) {
                                                console.log(error);
                                            }
                                            else {
                                                console.log('Successful query');
                                                //hier ist das ergebnis in rows
                                            }
                                        });
                                    }
                                }
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
})
        
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'trackerdata'
});

connection.connect(function(error){
    if(error) {
        console.log(error);
    }
    else {
        console.log('Connected');
    }
});

app.listen(3001, () => console.log('listening at 3001'));