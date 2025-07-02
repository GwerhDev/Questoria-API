const router = require('express').Router();
const { cookieDomain } = require("../config");

router.post("/logout", (req, res) => {
  res.clearCookie('token', { domain: cookieDomain, path: '/' });
  return res.status(200).send({ logged: false, message: "Logged out successfully" });
});

module.exports = router;