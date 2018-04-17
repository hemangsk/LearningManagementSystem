const jwt = require('jsonwebtoken');
const config = require('./config');


function verifyToken(req, res, next) {

    var token = req.headers['authorization'].substring(4);

    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            console.log(err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;
