const router = require("express").Router();
const User = require("../models/User");
const { decodeToken } = require("../integrations/jwt");

router.use(async (req, res, next) => {
  try {
    const userToken = req.cookies.token;
    const decodedToken = await decodeToken(userToken);
    const user = await User.findById(decodedToken.data.id);

    if (!user || user.role !== "admin") {
      return res.status(403).send({ message: "You are not authorized to access this resource" });
    }

    next();
  } catch (error) {
    return res.status(500).send({ error: "Error validating user role" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: "Error fetching users" });
  }
});

router.patch("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, status } = req.body;

    const user = await User.findById(id);

    if (!user) return res.status(404).send({ message: "User not found" });

    await User.update(id, { username, email, role, status });

    return res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).send({ error: "Error updating user" });
  }
});

module.exports = router;