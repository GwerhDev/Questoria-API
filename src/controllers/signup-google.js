const express = require("express");
const router = express.Router();
const passport = require("passport");
const userSchema = require("../models/User");
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
    const existingUser = await userSchema.findOne({ email: user.email });

    if (existingUser) {
      const tokenData = {
        id: existingUser._id,
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
      profilePic: null,
      isVerified: true,
      method: methods.google,
      googleId: user.googleId,
      googlePic: user.photo ?? null,
      role: roles.student,
      status: status.active,
    };

    if (teacherEmailList.includes(user.email)) userData.role = roles.teacher;
    if (adminEmailList.includes(user.email)) userData.role = roles.admin;

    const userCreated = new userSchema(userData);
    await userCreated.save();

    const tokenData = {
      id: userCreated._id,
      role: userCreated.role,
    };

    const token = await createToken(tokenData, 3);
    res.cookie('token', token, { httpOnly: true, secure: cookieSecure, domain: cookieDomain, sameSite: 'Lax' });
    return res.status(200).redirect(`${clientUrl}/auth`);

  } catch (error) {
    return res.send(error);
  }
});

module.exports = router;