const router = require("express").Router();
const Quest = require("../models/Quest");
const User = require("../models/User");
const Adventure = require("../models/Adventure");
const { decodeToken } = require("../integrations/jwt");
const supabase = require("../integrations/supabase");

router.post("/", async (req, res) => {
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
      reward_id: rewardId,
      level_requirement: levelRequirement,
      created_by_user_id: user.id,
    });

    // Add the quest to the adventure's quests array
    if (adventureId) {
      const { error: linkError } = await supabase
        .from('adventure_quests')
        .insert({
          adventure_id: adventureId,
          quest_id: newQuest.id,
        });
      if (linkError) throw linkError;
    }

    return res.status(201).send({ message: "Quest created successfully", questId: newQuest.id });
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

router.get("/:questId", async (req, res) => {
  try {
    const { questId } = req.params;
    const quest = await Quest.findById(questId);
    if (!quest) {
      return res.status(404).send({ message: "Quest not found" });
    }
    return res.status(200).send(quest);
  } catch (error) {
    return res.status(500).send({ error: "Error fetching quest details" });
  }
});

module.exports = router;