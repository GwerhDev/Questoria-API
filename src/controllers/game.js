const router = require("express").Router();
const userSchema = require("../models/User");
const questSchema = require("../models/Quest");
const rewardSchema = require("../models/Reward");
const { message } = require("../messages");
const { decodeToken } = require("../integrations/jwt");

router.post("/gain-experience", async (req, res) => {
  try {
    const userToken = req.headers.authorization;
    const { experience } = req.body;

    const decodedToken = await decodeToken(userToken);
    const user = await userSchema.findOne({ _id: decodedToken.data.id });

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    user.experience += experience;

    await user.save();

    return res.status(200).send({ message: "Experience gained successfully" });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

router.post("/level-up", async (req, res) => {
  try {
    const userToken = req.headers.authorization;

    const decodedToken = await decodeToken(userToken);
    const user = await userSchema.findOne({ _id: decodedToken.data.id });

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    user.level += 1;

    await user.save();

    return res.status(200).send({ message: "Leveled up successfully" });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

router.post("/gain-points", async (req, res) => {
  try {
    const userToken = req.headers.authorization;
    const { points } = req.body;

    const decodedToken = await decodeToken(userToken);
    const user = await userSchema.findOne({ _id: decodedToken.data.id });

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    user.points += points;

    await user.save();

    return res.status(200).send({ message: "Points gained successfully" });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

router.post("/complete-quest", async (req, res) => {
  try {
    const userToken = req.headers.authorization;
    const { questId } = req.body;

    const decodedToken = await decodeToken(userToken);
    const user = await userSchema.findOne({ _id: decodedToken.data.id });

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    const quest = await questSchema.findOne({ _id: questId }).populate('reward');

    if (!quest) return res.status(404).send({ message: "Quest not found" });

    if (quest.reward) {
      user.points += quest.reward.points;
      user.experience += quest.reward.experience;
    }

    await user.save();

    return res.status(200).send({ message: "Quest completed successfully" });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

module.exports = router;