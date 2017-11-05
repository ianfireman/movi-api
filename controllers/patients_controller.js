const Patient = require('../models/Patient');
const passport = require('passport');
const Movement = require('../models/Movement');
const Verify = require('../helpers/verify_helper');
const mqtt = require('mqtt');
const perform = require('../helpers/response_helper');
const _ = require('lodash');
const publisher = mqtt.connect('mqtt://10.0.98.28:1883')


exports.index = (req, res, next) => {
  let userId = req.decoded.user_id;

  Patient.find({'user': userId}, function (err, patients) {
    if (err) return next(err);

    res.json(patients);
  });
};

exports.show = (req, res, next) => {
  Patient.findById(req.params.patientId).exec(function (err, patient) {
    if (err) return next(err);

    res.json(patient);
  });
};

exports.register = (req, res, next) => {
  Patient.create({
    'name': req.body.name,
    'description': req.body.description,
    'user': req.decoded.user_id
  }, function (err, patient) {
    if(err){
      return next(perform.error.validationFailed(err));
    }
    if(req.body.profileImgUrl) {
      patient.profileImgUrl = req.body.profileImgUrl;
    }
    if(req.body.email) {
      patient.email = req.body.email;
    }
    perform.success.register(res, patient);
  });
};

exports.update = (req, res, next) => {
  Patient.findByIdAndUpdate(req.params.patientId, {
    $set: req.body
  }, 
  {new: true},
  function (err, patient) {
    if (err) return next(err);

    res.json({
      status: 'Update successful!',
      success: true,
      patient: patient
    });
  });
};


exports.delete = (req, res, next) => {
  Patient.findByIdAndRemove(req.params.patientId, function (err, resp) {
    if (err) return next(err);

    res.json(resp);
  });
};

exports.registerMovement = (req, res, next) => {
  Movement.create({
    'name': req.body.name,
    'patient': req.params.patientId
  }, function (err, movement) {
    if(err){
      return next(perform.error.validationFailed(err));
    }
    if(req.body.defaultRecord) {
      movement.defaultRecord = req.body.defaultRecord;
    }
    perform.success.register(res, movement);
  });
};

exports.getMovements = (req, res, next) => {
  Movement.find({'patient': req.params.patientId}, function (err, movements) {
    if (err) return next(err);

    res.json(movements);
  });
};

exports.startMovement = (req, res, next) => {
  Movement.findById(req.params.movementId).exec(function (err, movement) {
    if (err) return next(err);

    publisher.publish('movi/action', "start");
    res.json(movement);
  });
};

exports.stopMovement = (req, res, next) => {
  Movement.findById(req.params.movementId).exec(function (err, movement) {
    if (err) return next(err);
    
    publisher.publish('movi/action', "stop");
    res.json(movement);
  });
};

let allowedParams = ['email', 'description', 'name', 'profileImgUrl', 'userId'];
function hasNotAllowedParams(params, allowed = allowedParams) {
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