const express = require('express');
const router = express.Router();

//initialize the database controllers
const users = require("../controllers/userController");
const activity = require("../controllers/activityController");
const sport = require("../controllers/sportController");
const event = require("../controllers/calendarController");
const chart = require("../controllers/chartController");
const feed = require("../controllers/feedController");
const comment = require("../controllers/interactionController");
const googlefit = require("../controllers/googlefitController");

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

router.get('/users/get/:user', authenticateJWT, users.getInformation);
router.put('/users/update', authenticateJWT, users.updateInformation);
router.get('/users/search', authenticateJWT, users.search);
router.put('/users/block', authenticateJWT, users.block);
router.put('/users/unblock', authenticateJWT, users.unblock);
router.put('/users/follow', authenticateJWT, users.follow);
router.put('/users/unfollow', authenticateJWT, users.unfollow);
router.get('/users/getRelationship', authenticateJWT, users.getRelationship);

router.get('/events/get', authenticateJWT, event.findAll);
router.get('/events/getactivity', authenticateJWT, event.findActivityEvents);
router.post('/events/add', authenticateJWT, event.create);
router.delete('/events/remove', authenticateJWT, event.remove);


router.get('/sports/fetch', authenticateJWT, sport.getAll);

router.post('/activity/add', authenticateJWT, activity.add);
router.delete('/activity/remove', authenticateJWT, event.removeactivity);
router.get('/feed/:type/', authenticateJWT, feed.getFeed);

router.post('/interaction/addComment', authenticateJWT, comment.addComment);
router.get('/interaction/commentIsNew', authenticateJWT, comment.getComment);

router.put('/interaction/thumbsUp', authenticateJWT, comment.thumbsUp);
router.get('/interaction/isThumbsUpSet', authenticateJWT, comment.isThumbsUpSet);
router.get('/interaction/countThumbs', authenticateJWT, comment.countThumbs);

router.get('/googlefit/getURLTing', googlefit.getFitURL);
router.get('/googlefit/activity', googlefit.insertActivitysFromGoogle);

router.get('/testConnection', function (req, res, next) {
    res.send('Connection to the backend established!');
})

/* charts routes */
router.get('/charts/get', authenticateJWT, chart.findAll);
router.get('/charts/dataset', authenticateJWT, chart.getdataset);
router.post('/charts/add', authenticateJWT, chart.create);
router.delete('/charts/remove', authenticateJWT, chart.remove);

module.exports = router;
