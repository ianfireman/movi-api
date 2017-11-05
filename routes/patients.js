var router = require('express').Router();
var verifyLogin = require('../helpers/verify_helper').verifyOrdinaryUser; // verify if user are loged
var logic = require('../controllers/patients_controller');

router.get('/', verifyLogin, logic.index);
router.post('/', verifyLogin, logic.register);
router.get('/:patientId/movements', verifyLogin, logic.getMovements);
router.post('/:patientId/registerMovement', verifyLogin, logic.registerMovement);
router.get('/:patientId/startMovement/:movementId', verifyLogin, logic.startMovement);
router.get('/:patientId/stopMovement/:movementId', verifyLogin, logic.stopMovement);
router.route('/:patientId')
      .get(verifyLogin, logic.show)
      .put(verifyLogin, logic.update)
      .delete(verifyLogin, logic.delete);

module.exports = router;