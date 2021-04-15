const express = require('express');
const router = express.Router();

//initialize the database controllers
const users = require("../userController");

router.get('/', function (req, res, next) {
    res.render('index')
});

router.post('/login', function (req, res) {
    res.send('Login Recieved!');
    console.log(req);
});

router.post('/signup', users.signup);

router.get('/verify/:hash', users.verifyEmail);

router.get('/testConnection', function (req, res, next) {
    res.send('Connection to the backend established!');
})

module.exports = router;