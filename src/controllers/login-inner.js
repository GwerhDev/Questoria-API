const router = require('express').Router();
const { createToken } = require('../integrations/jwt');
const { message } = require('../messages');
const User = require('../models/User');
const bcrypt = require("bcrypt");
const { cookieDomain, cookieSecure } = require("../config");

router.post('/', async(req,res) => { 
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if(!user) return res.status(400).send({ logged: false, message: message.login.failure });
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if(passwordMatch) {
      const { id, role } = user;
      const data = { id, role };
      const token = await createToken(data, 3);
      res.cookie('token', token, { httpOnly: true, secure: cookieSecure, domain: cookieDomain, sameSite: 'Lax' });
      const { redirect_uri } = req.query;
      if (redirect_uri) {
        return res.redirect(redirect_uri);
      } else {
        return res.status(200).send({ logged: true, message: message.login.success });
      }

    } else {
      return res.status(400).send({ logged: false, message: message.login.error });
    };
    
  } catch(error) {
    return res.status(400).send({ logged: false, message: message.login.error });
  }
});

module.exports = router;