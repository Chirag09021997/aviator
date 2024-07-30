const express = require('express');
const router = express.Router();
const authController = require('../controller/authenticationController');
const { authCheck } = require('../middleware/auth.middleware');
const dashBoardController = require('../controller/dashBoardController');

/* GET home page. */
router.get('/', authCheck, (req, res) => {
  res.redirect('/dashboard');
});

router.route('/register').get(authController.getRegister).post(authController.register);
router.route('/login').get(authController.getLogin).post(authController.login);
router.get('/logout', authCheck, authController.logout);

router.get('/dashboard', authCheck, dashBoardController.dashboard);
router.use('/bet-suggestion', authCheck, require('./web/betSuggestion'));
router.use('/cash-plan', authCheck, require('./web/cashPlan'));
router.use('/users', authCheck, require('./web/users'));
router.use('/upi-register', authCheck, require('./web/upiRegister'));
router.use('/payment-deposit', authCheck, require('./web/paymentDeposit'));
router.use('/payment-withdraw', authCheck, require('./web/paymentWithdraw'));
router.use('/game-strategy', authCheck, require("./web/gameStrategy"));
router.use('/settings', authCheck, require('./web/settings'))

router.use('/betting', authCheck, require('./web/betting'));
module.exports = router;
