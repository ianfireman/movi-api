var express = require('express');
var router = express.Router();

var home = require('./home');
var users = require('./users');
var patients = require('./patients');
var movements = require('./movements');

router.use('/', home);
router.use('/users', users);
router.use('/patients', patients);
router.use('/movements', movements);

module.exports = router;