const express = require('express');
const router = express.Router();

//initialize the database controllers
const users = require("../controllers/userController");
const activity = require("../controllers/activityController");
const sport = require("../controllers/sportController");
const comment = require("../controllers/commentController");

const {authenticateJWT} = require("../utilities/authentication/MiddlewareAuthentication");

router.get('/', function (req, res, next) {
    res.render('index')
});

router.post('/login', users.login );
  
router.post('/signup', users.signup );

router.post('/commend', comment.addCommend);
router.get('/commendisnew/:activity', comment.getComment);

router.post('/thumpsup', comment.thumpsup);
router.post('/isthumpsupset', comment.isthumpsupset);
router.get('/countThumps/:activity', comment.countThumps);

router.get('/profilesite/:user', comment.profilesite);
router.put('/profilesiteupdate', comment.profileUpdate);



router.get('/verify/:hash', function(req, res){
  users.verifyEmail(req, res);
  res.redirect('http://localhost:3000/verify');
});

router.post('/activity/add', authenticateJWT, activity.add);

router.all('/sports/fetch', sport.getAll);

router.get('/users/search', users.search);

router.get('/testConnection', function (req, res, next) {
    res.send('Connection to the backend established!');
})

module.exports = router;