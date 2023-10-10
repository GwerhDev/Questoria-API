const router = require('express').Router();
const loginGoogle = require('../controllers/login-google');

router.use("/login-google", loginGoogle);

module.exports = router;