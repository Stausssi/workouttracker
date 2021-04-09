var express = require('express');
var router = express.Router();

//initialize the database controllers
const users = require("../userController");
const activity = require("../activityController");
const sport = require("../sportController");

router.get('/', function (req, res, next) {
    res.render('index')
});

router.post('/login', users.login );
  
router.post('/signup', users.signup );

router.get('/verify/:hash', function(req, res){
  users.verifyEmail(req, res);
  res.redirect('http://localhost:3000/sign-up');
}); 

router.post('/activity/add', activity.add);

router.all('/sports/fetch', sport.getAll);

router.get('/testConnection', function (req, res, next) {
    res.send('Connection to the backend established!');
})

module.exports = router;