const router = require("express").Router();
const Quest = require("../models/Quest");
const User = require("../models/User");
const Adventure = require("../models/Adventure");
const { decodeToken } = require("../integrations/jwt");

router.post("/create", async (req, res) => {
  try {
    const userToken = req.cookies.token;
    const { title, description, rewardId, levelRequirement, adventureId } = req.body;

    const decodedToken = await decodeToken(userToken);
    const user = await User.findById(decodedToken.data.id);

    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return res.status(403).send({ message: "You are not authorized to create quests" });
    }

    const newQuest = await Quest.create({
      title,
      description,
      reward: rewardId,
      levelRequirement,
      createdBy: user.id,
    });

    // Add the quest to the adventure's quests array
    const adventure = await Adventure.findById(adventureId);
    if (adventure) {
      await Adventure.update(adventure.id, { quests: [...adventure.quests, newQuest.id] });
    }

    await User.update(user.id, { createdQuests: [...user.createdQuests, newQuest.id] });

    return res.status(201).send({ message: "Quest created successfully" });
  } catch (error) {
    return res.status(500).send({ error: "Error creating quest" });
  }
});

router.get("/", async (req, res) => {
  try {
    const quests = await Quest.findAll();
    return res.status(200).send(quests);
  } catch (error) {
    return res.status(500).send({ error: "Error fetching quests" });
  }
});

module.exports = router;