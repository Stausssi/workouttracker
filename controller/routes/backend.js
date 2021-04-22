const express = require('express');
const router = express.Router();

//initialize the database controllers
const users = require("../controllers/userController");
const activity = require("../controllers/activityController");
const sport = require("../controllers/sportController");

const {authenticateJWT} = require("../utilities/authentication/MiddlewareAuthentication");
const event = require("../calendarController");
const chart = require("../chartController");

router.get('/', function (req, res, next) {
    res.render('index')
});

router.post('/login', users.login);
router.post('/signup', users.signup);

router.get('/verify/:hash', function (req, res) {
    users.verifyEmail(req, res);
    res.redirect('http://localhost:3000/verify');
});

router.post('/activity/add', authenticateJWT, activity.add);

router.get('/sports/fetch', authenticateJWT, sport.getAll);

router.get('/users/search', authenticateJWT, users.search);
router.put('/users/block', authenticateJWT, users.block);
router.put('/users/unblock', authenticateJWT, users.unblock);
router.put('/users/follow', authenticateJWT, users.follow);
router.put('/users/unfollow', authenticateJWT, users.unfollow);
router.get('/users/getRelationship', authenticateJWT, users.getRelationship);

router.get('/events/get', event.findAll); 

router.post('/events/add', event.create); 

router.delete('/events/remove', event.remove);  //delete?

/* charts routes */
router.get('/charts/get', chart.findAll); 

router.get('/charts/dataset', chart.getdataset); 

router.post('/charts/add', chart.create); 

router.delete('/charts/remove', chart.remove);


/*

//router.get('/charts/update', chart.findAll); 

//router.post('/charts/remove', chart.create); 

/* Calendar routes */

router.get('/events/get', event.findAll); 

router.post('/events/add', event.create); 

router.delete('/events/remove', event.remove);  //delete?

/* charts routes */
router.get('/charts/get', chart.findAll); 

router.get('/charts/dataset', chart.getdataset); 

router.post('/charts/add', chart.create); 

router.delete('/charts/remove', chart.remove);


/*

router.get('/charts/update', chart.findAll); 

*/
router.get('/testConnection', function (req, res, next) {
    res.send('Connection to the backend established!');
})

module.exports = router;
