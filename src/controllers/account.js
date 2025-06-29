const router = require("express").Router();
const userSchema = require("../models/User");
const { message } = require("../messages");
const { decodeToken } = require("../integrations/jwt");

router.get("/my-data", async (req, res) => {
  try {
    const userToken = req.headers.authorization;

    const decodedToken = await decodeToken(userToken);
    const user = await userSchema.findOne({ _id: decodedToken.data.id });

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    let userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
      profilePic: user.profilePic || user.googlePic,
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
    const userToken = req.headers.authorization;
    const { username, profilePic } = req.body;

    const decodedToken = await decodeToken(userToken);
    const user = await userSchema.findOne({ _id: decodedToken.data.id });

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    if (username) user.username = username;
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    return res.status(200).send({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

module.exports = router;