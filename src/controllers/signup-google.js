const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const { signupGoogle } = require("../integrations/google-auth");
const { createToken } = require("../integrations/jwt");
const { clientUrl, defaultPassword, defaultUsername, adminEmailList, teacherEmailList, cookieDomain, cookieSecure } = require("../config");
const { status, methods, roles } = require("../misc/consts-user-model");

passport.use('signup-google', signupGoogle);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/', passport.authenticate('signup-google', { state: '200' }));

router.get('/callback', passport.authenticate('signup-google', {
  successRedirect: '/signup-google/success',
  failureRedirect: '/signup-google/failure'
}));

router.get('/failure', (req, res) => {
  return res.status(400).redirect(`${clientUrl}/register/failed`);
});

router.get('/success', async (req, res) => {
  try {
    const user = req.session.passport.user
    const existingUser = await User.findByEmail(user.email);

    if (existingUser) {
      const tokenData = {
        id: existingUser.id,
        role: existingUser.role,
      };
      const token = await createToken(tokenData, 3);
      res.cookie('token', token, { httpOnly: true, secure: cookieSecure, domain: cookieDomain, sameSite: 'Lax' });
      return res.status(200).redirect(`${clientUrl}/auth`);
    }

    const userData = {
      username: user.username ?? defaultUsername,
      password: defaultPassword,
      email: user.email,
      profile_pic: user.photo ?? null,
      is_verified: true,
      method: methods.google,
      role: roles.student,
      status: status.active,
    };

    if (teacherEmailList.includes(user.email)) userData.role = roles.teacher;
    if (adminEmailList.includes(user.email)) userData.role = roles.admin;

    const userCreated = await User.create(userData);

    const tokenData = {
      id: userCreated.id,
      role: userCreated.role,
    };

    const token = await createToken(tokenData, 3);
    res.cookie('token', token, { httpOnly: true, secure: cookieSecure, domain: cookieDomain, sameSite: 'Lax' });
    return res.status(200).redirect(`${clientUrl}/`);

  } catch (error) {
    return res.send(error);
  }
});

module.exports = router;