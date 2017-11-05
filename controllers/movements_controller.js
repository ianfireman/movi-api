const Patient = require('../models/Patient');
const passport = require('passport');
const Movement = require('../models/Movement');
const Verify = require('../helpers/verify_helper');
const perform = require('../helpers/response_helper');
const _ = require('lodash');

exports.show = (req, res, next) => {
    Movement.findById(req.params.movementId).exec(function (err, movement) {
    if (err) return next(err);

    res.json(movement);
  });
};

exports.update = (req, res, next) => {
  Movement.findByIdAndUpdate(req.params.movementId, {
    $set: req.body
  }, 
  {new: true},
  function (err, movement) {
    if (err) return next(err);

    res.json({
      status: 'Update successful!',
      success: true,
      movement: movement
    });
  });
};