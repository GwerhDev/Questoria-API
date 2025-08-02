const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const { clientUrl, cookieDomain, cookieSecure } = require("../config");
const { createToken } = require("../integrations/jwt");
const { loginGoogle } = require("../integrations/google-auth");

passport.use('login-google', loginGoogle);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/', (req, res, next) => {
  const { redirect_uri } = req.query;
  const state = redirect_uri ? JSON.stringify({ redirect_uri }) : undefined;
  passport.authenticate('login-google', { state: state || '200' })(req, res, next);
});

router.get('/callback', passport.authenticate('login-google', {
  successRedirect: '/login-google/success',
  failureRedirect: '/login-google/failure'
}));

router.get('/success', async (req, res) => {
  try {
    const user = req.session.passport.user;
    const userExist = await User.findByEmail(user.email);
    let redirectUrl = `${clientUrl}/`;

    if (user.redirect_uri) {
      redirectUrl = user.redirect_uri;
      delete user.redirect_uri; // Clean up the user object
    }

    if (userExist) {
      const { id, role } = userExist;
      const data_login = { id: id, role };
      const token = await createToken(data_login, 3);
      res.cookie('token', token, { httpOnly: true, secure: cookieSecure, domain: cookieDomain, sameSite: 'Lax' });
      return res.status(200).redirect(redirectUrl);
    } else {
      return res.status(400).redirect(redirectUrl);
    }
  } catch (error) {
    return res.status(400).redirect(`${clientUrl}/`);
  }
});

module.exports = router;