var router = require('express').Router();
var verifyLogin = require('../helpers/verify_helper').verifyOrdinaryUser; // verify if user are loged
var logic = require('../controllers/movements_controller');

router.route('/:movementId')
      .get(verifyLogin, logic.show)
      .put(verifyLogin, logic.update);

module.exports = router;