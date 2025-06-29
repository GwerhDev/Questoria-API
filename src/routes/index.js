const router = require('express').Router();
const auth = require('../controllers/auth');
const account = require('../controllers/account');
const adventure = require('../controllers/adventure');
const loginInner = require('../controllers/login-inner');
const signupInner = require('../controllers/signup-inner');
const loginGoogle = require('../controllers/login-google');
const signupGoogle = require('../controllers/signup-google');
const game = require('../controllers/game');
const quest = require('../controllers/quest');
const admin = require('../controllers/admin');

router.use("/auth", auth);
router.use("/account", account);
router.use("/adventure", adventure);
router.use("/login-inner", loginInner);
router.use("/signup-inner", signupInner);
router.use("/login-google", loginGoogle);
router.use("/signup-google", signupGoogle);
router.use("/game", game);
router.use("/quest", quest);
router.use("/admin", admin);

module.exports = router;