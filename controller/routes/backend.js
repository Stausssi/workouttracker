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

router.post('/login', users.login );
  
router.post('/signup', users.signup );

router.get('/verify/:hash', function(req, res){
  users.verifyEmail(req, res);
  res.redirect('http://localhost:3000/verify');
});

router.post('/activity/add', authenticateJWT, activity.add);

router.all('/sports/fetch', sport.getAll);

//router.get('/users/search', users.search);

/* Calendar routes */

router.get('/events/get', event.findAll); 

router.post('/events/add', event.create); 

router.post('/events/update', event.update); //put?

router.post('/events/remove', event.remove);  //delete?

/* charts routes */
router.get('/charts/get', chart.findAll); 


router.get('/charts/dataset', chart.getdataset); 
router.post('/charts/add', chart.create); 
/*

router.get('/charts/update', chart.findAll); 

router.post('/charts/remove', chart.create); 
*/
router.get('/testConnection', function (req, res, next) {
    res.send('Connection to the backend established!');
})

module.exports = router;
