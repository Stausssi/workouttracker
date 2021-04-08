const config = require("./AccessTokenSecret.config");

// Middleware function, that authenticates the AccessToken of a user request 
// inside the authorization header --> has to be set

// should be used like this with protected routes:

// app.get('/books', authenticateJWT, (req, res) => {
//     res.json(books);
// });

exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403); // 403: Forbidden
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // 401: Unauthorised
    }
};