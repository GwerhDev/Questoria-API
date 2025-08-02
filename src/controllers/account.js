const router = require("express").Router();
const User = require("../models/User");
const { message } = require("../messages");
const { decodeToken } = require("../integrations/jwt");

router.get("/my-data", async (req, res) => {
  try {
    const userToken = req.cookies.token;

    const decodedToken = await decodeToken(userToken);
    const user = await User.findById(decodedToken.data.id);

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    let userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      isVerified: user.is_verified,
      role: user.role,
      profile_pic: user.profile_pic || user.google_pic,
    };

    if (user.role === 'student') {
      userData.experience = user.experience;
      userData.level = user.level;
      userData.points = user.points;
      userData.inventory = user.inventory;
      
    } else if (user.role === 'teacher') {
      userData.createdQuests = user.createdQuests;
      userData.createdAdventures = user.createdAdventures;
    }

    return res.status(200).send({ logged: true, userData });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

router.patch("/update-profile", async (req, res) => {
  try {
    const userToken = req.cookies.token;
    const { username, profile_pic } = req.body;

    const decodedToken = await decodeToken(userToken);
    const user = await User.findById(decodedToken.data.id);

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    await User.update(user.id, { username, profile_pic: profile_pic });

    return res.status(200).send({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

module.exports = router;