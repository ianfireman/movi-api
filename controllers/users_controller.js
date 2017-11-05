const User = require('../models/User');
const Patient = require('../models/Patient');
const Movement = require('../models/Movement');
const passport = require('passport');
const Verify = require('../helpers/verify_helper');
const serialize = require('../helpers/serializers/user');
const perform = require('../helpers/response_helper');
const _ = require('lodash');

exports.index = (req, res, next) => {
  User.find({}, function (err, users) {
    if (err) return next(err);

    res.json(users);
  });
};

exports.signup = (req, res, next) => {
  let newUser = new User(
    {
      username : req.body.username,
      email: req.body.email,
      profession: req.body.profession
    });
  User.register(newUser, req.body.password, function(err, user) {
    if(err) return next(perform.error.validationFailed(err));

    if(req.body.firstname) {
      user.firstname = req.body.firstname;
    }
    if(req.body.lastname) {
      user.lastname = req.body.lastname;
    }
    if(req.body.profileImgUrl) {
      user.imageUrlProfile = req.body.profileImgUrl;
    }
    user.save(function(err,user) {
      if (err) return next(err);

      passport.authenticate('user')(req, res, function () {
        return res.status(200).json({status: 'Registration Successful!'});
      });
    });
  });
};

exports.login = (req, res, next) => {
  passport.authenticate('user', { session: false } ,function(err, user, info) {
    if (err || info) return next(perform.error.loginFailed(err || info));

    if (user.actived){
      req.logIn(user, function(err) {
        if (err) return next(perform.error.loginFailed(err));

        let token = Verify.getToken(user);
        res.status(200).json({
          status: 'Login successful!',
          success: true,
          token: token,
          user: serialize.basic(user)
        });
      });
    } else {
      res.status(401).json({
        status: 'Could not login because user not activated',
        success: false,
        user: serialize.basic(user)
      });
    }
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
};

exports.show = (req, res, next) => {
  User.findById(req.params.userId).exec(function (err, user) {
    if (err) return next(err);

    res.json(user);
  });
};

exports.update = (req, res, next) => {
  if (hasNotAllowedParams(req.body)) return next(perform.error.paramsNotAllowed());

  User.findByIdAndUpdate(req.params.userId, {
    $set: req.body
  }, 
  {new: true},
  function (err, user) {
    if (err) return next(err);

    res.json({
      status: 'Update successful!',
      success: true,
      user: serialize.basic(user)
    });
  });
};

exports.delete = (req, res, next) => {
  User.findByIdAndRemove(req.params.userId, function (err, resp) {
    if (err) return next(err);

    res.json(resp);
  });
};

exports.getPatients = (req, res, next) => {
  Patient.find({user: req.params.userId}, function (err, patients) {
    if (err) return next(err);

    res.json(patients);
  });
};

let allowedParams = ['email', 'username', 'firstname', 'lastname', 'codigoDeInscricao', 'profession', 'profileImgUrl'];
function hasNotAllowedParams(params, allowed = allowedParams){
  let paramsArray = Object.keys(params);
  if (paramsArray.length > allowed.length){
    return true;
  } else {
    if(_.isEqual(paramsArray.sort(), allowed.sort())){
      return false;
    } else {
      return true;
    }
  }
}