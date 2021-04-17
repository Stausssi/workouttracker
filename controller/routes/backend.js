const express = require('express');
const router = express.Router();

//initialize the database controllers
const users = require("../controllers/userController");
const activity = require("../controllers/activityController");
const sport = require("../controllers/sportController");

const {authenticateJWT} = require("../utilities/authentication/MiddlewareAuthentication");

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

router.all('/sports/fetch', sport.getAll);

router.get('/users/search', authenticateJWT, users.search);
router.post('/users/block', authenticateJWT, users.block);
router.post('/users/follow', authenticateJWT, users.follow);
router.post('/users/unfollow', authenticateJWT, users.unfollow);
router.post('/users/getRelationship', authenticateJWT, users.getRelationship);

router.get('/testConnection', function (req, res, next) {
    res.send('Connection to the backend established!');
})

module.exports = router;