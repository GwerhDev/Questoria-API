const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { message } = require("../messages");
const { status, roles, methods } = require("../misc/consts-user-model");
const { createToken } = require("../integrations/jwt");
const { adminEmailList, teacherEmailList, cookieDomain, cookieSecure } = require("../config");

router.post('/', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if(!username || !password || !email) return res.status(400).send({ error: message.signup.error });
    
    const existingUser = await User.findByEmail(email);
    
    if(existingUser) {
      const tokenData = {
        id: existingUser.id,
        role: existingUser.role,
      };
      const token = await createToken(tokenData, 3);
      res.cookie('token', token, { httpOnly: true, secure: cookieSecure, domain: cookieDomain, sameSite: 'Lax' });
      return res.status(200).send({ msg: message.signup.success });
    };
    
    const userData = {
      username,
      password,
      email,
      profile_pic: null,
      status: status.inactive,
      is_verified: false,
      method: methods.inner,
      role: roles.student,
    };
    
    const salt = await bcrypt.genSalt();
    userData.password = await bcrypt.hash(password, salt);

    if(teacherEmailList.includes(email)) userData.role = roles.teacher;
    if(adminEmailList.includes(email)) userData.role = roles.admin;
    
    const userCreated = await User.create(userData);

    const tokenData = {
      id: userCreated.id,
      role: userCreated.role,
    };
    const token = await createToken(tokenData, 3);
    res.cookie('token', token, { httpOnly: true, secure: cookieSecure, domain: cookieDomain, sameSite: 'Lax' });
    return res.status(200).send({ msg: message.signup.success });

  } catch (error) {
    return res.status(400).send({ error: message.signup.error });
  };
});

module.exports = router;