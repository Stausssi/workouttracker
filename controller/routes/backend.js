const express = require('express');
const router = express.Router();

//initialize the database controllers
const users = require("../controllers/userController");
const activity = require("../controllers/activityController");
const sport = require("../controllers/sportController");
const comment = require("../controllers/commentController");
const profile = require("../controllers/profileController");
const googlefit = require("../controllers/googlefitController");

const {authenticateJWT} = require("../utilities/authentication/MiddlewareAuthentication");

router.get('/', function (req, res, next) {
    res.render('index')
});

router.post('/login', users.login );
  
router.post('/signup', users.signup );

router.post('/commend', authenticateJWT, comment.addCommend);
router.get('/commendisnew/:activity', authenticateJWT, comment.getComment);

router.post('/thumpsup', authenticateJWT, comment.thumpsup);
router.get('/isthumpsupset/:activity', authenticateJWT, comment.isthumpsupset);
router.get('/countThumps/:activity', authenticateJWT, comment.countThumps);

router.get('/profilesite/:user', authenticateJWT, profile.profilesite);
router.put('/profilesiteupdate', authenticateJWT, profile.profileUpdate);

router.put('/googlefit/getURLTing', googlefit.getFitURL);
router.put('/googlefit/activity', googlefit.insertActivitysFromGoogle);


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