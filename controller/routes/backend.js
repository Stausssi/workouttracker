const express = require('express');
const router = express.Router();

//initialize the database controllers
const users = require("../controllers/userController");
const activity = require("../controllers/activityController");
const sport = require("../controllers/sportController");
const feed = require("../controllers/feedController");
const comment = require("../controllers/commentController");
const profile = require("../controllers/profileController");
const googlefit = require("../controllers/googlefitController");

const {authenticateJWT} = require("../utilities/authentication/MiddlewareAuthentication");

router.get('/', function (req, res, next) {
    res.render('index')
});

router.post('/login', users.login);
router.post('/signup', users.signup);

router.post('/commend', authenticateJWT, comment.addCommend);
router.get('/commendisnew/:activity', authenticateJWT, comment.getComment);

router.post('/thumpsup', authenticateJWT, comment.thumpsup);
router.get('/isthumpsupset/:activity', authenticateJWT, comment.isthumpsupset);
router.get('/countThumps/:activity', authenticateJWT, comment.countThumps);

router.get('/profilesite/:user', authenticateJWT, profile.profilesite);
router.put('/profilesiteupdate', authenticateJWT, profile.profileUpdate);

router.get('/googlefit/getURLTing', googlefit.getFitURL);
router.get('/googlefit/activity', googlefit.insertActivitysFromGoogle);


router.get('/verify/:hash', function(req, res){
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

router.get('/feed/:type/', authenticateJWT, feed.getFeed);

router.get('/testConnection', function (req, res, next) {
    res.send('Connection to the backend established!');
})

module.exports = router;