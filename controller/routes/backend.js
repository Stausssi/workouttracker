var express = require('express');
var router = express.Router();

//initialize the database controllers
const users = require("../Controllers/userController");

router.post('/login', users.login );
  
router.post('/signup', users.signup );
  
router.get('/verify/:hash', function(req, res){
  users.verifyEmail(req, res);
  res.redirect('http://localhost:3000/sign-up');
}); 

module.exports = router;