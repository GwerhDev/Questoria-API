const router = require("express").Router();
const User = require("../models/User");
const Quest = require("../models/Quest");
const Reward = require("../models/Reward");
const { message } = require("../messages");
const { decodeToken } = require("../integrations/jwt");

router.post("/gain-experience", async (req, res) => {
  try {
    const userToken = req.cookies.token;
    const { experience } = req.body;

    const decodedToken = await decodeToken(userToken);
    const user = await User.findById(decodedToken.data.id);

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    await User.update(user.id, { experience: user.experience + experience });

    return res.status(200).send({ message: "Experience gained successfully" });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

router.post("/level-up", async (req, res) => {
  try {
    const userToken = req.cookies.token;

    const decodedToken = await decodeToken(userToken);
    const user = await User.findById(decodedToken.data.id);

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    await User.update(user.id, { level: user.level + 1 });

    return res.status(200).send({ message: "Leveled up successfully" });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

router.post("/gain-points", async (req, res) => {
  try {
    const userToken = req.cookies.token;
    const { points } = req.body;

    const decodedToken = await decodeToken(userToken);
    const user = await User.findById(decodedToken.data.id);

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    await User.update(user.id, { points: user.points + points });

    return res.status(200).send({ message: "Points gained successfully" });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

router.post("/complete-quest", async (req, res) => {
  try {
    const userToken = req.cookies.token;
    const { questId } = req.body;

    const decodedToken = await decodeToken(userToken);
    const user = await User.findById(decodedToken.data.id);

    if (!user) return res.status(404).send({ logged: false, message: message.user.notfound });

    const quest = await Quest.findById(questId);

    if (!quest) return res.status(404).send({ message: "Quest not found" });

    if (quest.reward) {
      await User.update(user.id, { 
        points: user.points + quest.reward.points,
        experience: user.experience + quest.reward.experience
      });
    }

    return res.status(200).send({ message: "Quest completed successfully" });
  } catch (error) {
    return res.status(500).send({ error: message.user.error });
  }
});

module.exports = router;