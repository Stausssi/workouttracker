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

const {BACKEND_URL, FRONTEND_URL} = require("../utilities/misc");

const {authenticateJWT} = require("../utilities/authentication/MiddlewareAuthentication");

router.get('/', function (req, res, next) {
    res.render('index')
});

router.post('/login', users.login);
router.post('/signup', users.signup);
router.get('/verify/:hash', function (req, res) {
    users.verifyEmail(req, res);
    res.redirect(FRONTEND_URL + '/verify');
});

router.get('/users/get/:user', authenticateJWT, users.getInformation);
router.put('/users/update', authenticateJWT, users.updateInformation);
router.get('/users/search', authenticateJWT, users.search);
router.put('/users/block', authenticateJWT, users.block);
router.put('/users/unblock', authenticateJWT, users.unblock);
router.put('/users/follow', authenticateJWT, users.follow);
router.put('/users/unfollow', authenticateJWT, users.unfollow);
router.get('/users/getRelationship', authenticateJWT, users.getRelationship);

router.get('/events/get', authenticateJWT, event.get);
router.post('/events/add', authenticateJWT, event.create);
router.delete('/events/remove', authenticateJWT, event.remove);

router.get('/charts/get', authenticateJWT, chart.get);
router.get('/charts/dataset', authenticateJWT, chart.getDataset);
router.post('/charts/add', authenticateJWT, chart.create);
router.delete('/charts/remove', authenticateJWT, chart.remove);

router.get('/sports/fetch', authenticateJWT, sport.getAll);

router.get('/activity/get', authenticateJWT, activity.get);
router.post('/activity/add', authenticateJWT, activity.add);
router.delete('/activity/remove', authenticateJWT, activity.remove);
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

module.exports = router;
