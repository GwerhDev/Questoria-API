const router = require("express").Router();
const questSchema = require("../models/Quest");
const userSchema = require("../models/User");
const adventureSchema = require("../models/Adventure");
const { decodeToken } = require("../integrations/jwt");

router.post("/create", async (req, res) => {
  try {
    const userToken = req.headers.authorization;
    const { title, description, rewardId, levelRequirement, adventureId } = req.body;

    const decodedToken = await decodeToken(userToken);
    const user = await userSchema.findOne({ _id: decodedToken.data.id });

    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return res.status(403).send({ message: "You are not authorized to create quests" });
    }

    const newQuest = new questSchema({
      title,
      description,
      reward: null,
      levelRequirement,
      createdBy: user._id,
    });

    await newQuest.save();

    // Add the quest to the adventure's quests array
    const adventure = await adventureSchema.findOne({ _id: adventureId });
    if (adventure) {
      adventure.quests.push(newQuest._id);
      await adventure.save();
    }

    user.createdQuests.push(newQuest._id);
    await user.save();

    return res.status(201).send({ message: "Quest created successfully" });
  } catch (error) {
    return res.status(500).send({ error: "Error creating quest" });
  }
});

router.get("/", async (req, res) => {
  try {
    const quests = await questSchema.find();
    return res.status(200).send(quests);
  } catch (error) {
    return res.status(500).send({ error: "Error fetching quests" });
  }
});

module.exports = router;