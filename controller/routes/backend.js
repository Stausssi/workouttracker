var express = require('express');
var router = express.Router();

//initialize the database controllers
const users = require("../userController");

router.post('/login', function (req, res) {
    res.send('Login Recieved!');
    console.log(req);
  });
  
router.post('/signup', users.signup );
  
router.get('/verify/:hash', function(req, res){
  users.verifyEmail(req, res);
  res.sendFile(path.join(__dirname + '../update.html'));
}); 


module.exports = router;