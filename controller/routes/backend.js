var express = require('express');
var router = express.Router();

//initialize the database controllers
const users = require("../Controllers/userController");
const activity = require("../Controllers/activityController");
const sport = require("../Controllers/sportController");

const {authenticateJWT} = require("../Authentication/MiddlewareAuthentication");
const event = require("../calendarController");
const chart = require("../chartController");

router.get('/', function (req, res, next) {
    res.render('index')
});

router.post('/login', users.login );
  
router.post('/signup', users.signup );
  
router.get('/verify/:hash', function(req, res){
  users.verifyEmail(req, res);
  res.redirect('http://localhost:3000/sign-up');
}); 

router.post('/activity/add', authenticateJWT, activity.add);

/* Calendar routes */

router.get('/events/get', event.findAll); 

router.post('/events/add', event.create); 

router.post('/events/update', event.update); //put?

router.post('/events/remove', event.remove);  //delete?

/* charts routes */
router.get('/charts/get', chart.findAll); 

router.get('/charts/test', chart.test); 

router.get('/charts/dataset', chart.getdataset); 

/*router.get('/charts/dataset', function(request, res){
  console.warn(request)
  console.warn(response)
}); */


router.post('/charts/add', chart.create); 
/*



router.get('/charts/update', chart.findAll); 

router.post('/charts/remove', chart.create); 
*/
/* test connection */
router.all('/sports/fetch', sport.getAll);

router.get('/testConnection', function (req, res, next) {
    res.send('Connection to the backend established!');
})

module.exports = router;
