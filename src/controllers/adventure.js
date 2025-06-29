const router = require('express').Router();
const userSchema = require('../models/User');
const adventureSchema = require('../models/Adventure');
const { decodeToken } = require('../integrations/jwt');
const { message } = require('../messages');

router.post("/create", async (req, res) => {
  try {
    const userToken = req.headers.authorization;
    const { name, description } = req.body;

    const decodedToken = await decodeToken(userToken);
    const user = await userSchema.findOne({ _id: decodedToken.data.id });

    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return res.status(403).send({ message: "You are not authorized to create adventures" });
    }

    const newAdventure = new adventureSchema({
      name,
      description,
      createdBy: user._id,
    });

    await newAdventure.save();

    user.createdAdventures.push(newAdventure._id);
    await user.save();

    return res.status(201).send({ message: "Adventure created successfully", adventureId: newAdventure._id });
  } catch (error) {
    return res.status(500).send({ error: "Error creating adventure" });
  }
});

router.get("/", async (req, res) => {
  try {
    const adventures = await adventureSchema.find();
    return res.status(200).send(adventures);
  } catch (error) {
    return res.status(500).send({ error: "Error fetching adventures" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params || {};
    const adventure = await adventureSchema.findOne({ _id: id}).populate('quests');
    return res.status(200).send(adventure);
  } catch (error) {
    return res.status(500).send({ error: "Error fetching adventures" });
  }
});

module.exports = router;