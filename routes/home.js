var router = require('express').Router();
var logic = require('../controllers/home_controller');

router.get('/', logic.index);

module.exports = router;
