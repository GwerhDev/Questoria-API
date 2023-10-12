const router = require("express").Router();
const userSchema = require("../models/User");
const { message } = require("../messages");
const { decodeToken } = require("../integrations/jwt");
const bcrypt = require("bcrypt");

router.get("/my-data", async (req, res) => {
  try {
    const userToken = req.headers.authorization;

    const decodedToken = await decodeToken(userToken);
    const user = await userSchema.findOne({_id: decodedToken.data.id});

    if(!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
      profilePic: user.profilePic || user.googlePic
    };

    return res.status(200).send({ logged: true, userData });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

module.exports = router;