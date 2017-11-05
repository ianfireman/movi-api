var router = require('express').Router();
var verifyLogin = require('../helpers/verify_helper').verifyOrdinaryUser; // verify if user are loged
var verifyUser = require('../helpers/verify_helper').verifyUser; // verify if user logged are the accessed
var verifySimpleToken = require('../helpers/verify_helper').verifySimpleToken; // verify if user logged are the accessed
var logic = require('../controllers/users_controller');

router.get('/', verifyLogin, logic.index);
router.post('/signup', logic.signup);
router.post('/login', logic.login);
router.get('/:userId/patients', logic.getPatients);
router.get('/logout', verifyLogin, verifyUser, logic.logout);
router.route('/:userId')
      .get(verifyLogin, verifyUser, logic.show)
      .put(verifyLogin, verifyUser, logic.update)
      .delete(verifyLogin, verifyUser, logic.delete);

module.exports = router;