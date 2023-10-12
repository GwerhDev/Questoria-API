const router = require('express').Router();
const auth = require('../controllers/auth');
const account = require('../controllers/account');
const loginInner = require('../controllers/login-inner');
const signupInner = require('../controllers/signup-inner');
const loginGoogle = require('../controllers/login-google');
const signupGoogle = require('../controllers/signup-google');

router.use("/auth", auth);
router.use("/account", account);
router.use("/login-inner", loginInner);
router.use("/signup-inner", signupInner);
router.use("/login-google", loginGoogle);
router.use("/signup-google", signupGoogle);

module.exports = router;