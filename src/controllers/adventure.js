const router = require('express').Router();
const User = require('../models/User');
const Adventure = require('../models/Adventure');
const { decodeToken } = require('../integrations/jwt');
const { message } = require('../messages');

router.post("/create", async (req, res) => {
  try {
    const userToken = req.cookies.token;
    const { name, description } = req.body;

    const decodedToken = await decodeToken(userToken);
    const user = await User.findById(decodedToken.data.id);

    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return res.status(403).send({ message: "You are not authorized to create adventures" });
    }

    const newAdventure = await Adventure.create({
      name,
      description,
      createdBy: user.id,
    });

    await User.update(user.id, { createdAdventures: [...user.createdAdventures, newAdventure.id] });

    return res.status(201).send({ message: "Adventure created successfully", adventureId: newAdventure.id });
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