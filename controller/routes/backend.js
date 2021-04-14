var express = require('express');
var router = express.Router();

//initialize the database controllers
const users = require("../userController");
const activity = require("../activityController");
const sport = require("../sportController");
const event = require("../calendarController");
const chart = require("../chartController");

router.get('/', function (req, res, next) {
    res.render('index')
});

router.post('/login', function (req, res) {
    res.send('Login Recieved!');
    console.log(req);
});

router.post('/signup', users.signup);

router.get('/verify/:hash', users.verifyEmail);

router.post('/activity/add', activity.add);

router.all('/sports/fetch', sport.getAll);
/* Calendar routes */

router.get('/events/get', event.findAll); 

router.post('/events/add', event.create); 

router.post('/events/update', event.update); //put?

router.post('/events/remove', event.remove);  //delete?

/* charts routes */
router.get('/charts/get', chart.findAll); 

router.get('/charts/test', chart.test); 

/*
router.post('/charts/add', chart.create); 

router.get('/charts/update', chart.findAll); 

router.post('/charts/remove', chart.create); 
*/
/* test connection */

router.get('/testConnection', function (req, res, next) {
    res.send('Connection to the backend established!');
})

module.exports = router;
module.exports = router;
