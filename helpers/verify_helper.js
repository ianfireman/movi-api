const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('config');

exports.getToken = function (user) {
  return jwt.sign({ user_id: user._id }, config.get('userSecretKey'), {
    expiresIn: 604800 // one week
  });
};

exports.simpleToken = function (user){
  return jwt.sign({ user_id: user._id }, config.get('simpleSecret'), {
    expiresIn: 172800 // two days
  });
};

exports.verifyOrdinaryUser = function (req, res, next) {
  // check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
    
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.get('userSecretKey'), function (err, decoded) {
      if (err) {
        let err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        console.log(decoded);

        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    let err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
};

exports.verifySimpleToken = function (req, res, next) {
  // check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.get('simpleSecret'), function (err, decoded) {
      if (err) {
        let err = new Error('Token invalid!');
        err.status = 401;
        return next(err);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;

        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    let err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
};

exports.verifySimpleTokenInline = function (token, cb) {
  jwt.verify(token, config.get('simpleSecret'), function (err, decoded) {
    if (err) {
      let err = new Error('Token invalid!');
      err.status = 401;
      cb(err);
    } else {
      // if everything is good, send user id
      userId = decoded.user_id;
      cb(null, userId);
    }
  });
};

exports.verifyUser = function (req, res, next) {
  let loggedUser = req.decoded.user_id;
  let accessedUser = req.params.userId;
  if(loggedUser == accessedUser){
    next();
  } else {
    let err = new Error('You are not authorized!');
    err.status = 401;
    return next(err);
  }
};