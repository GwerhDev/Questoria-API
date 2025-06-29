const router = require("express").Router();
const userSchema = require("../models/User");
const { decodeToken } = require("../integrations/jwt");

router.use(async (req, res, next) => {
  try {
    const userToken = req.headers.authorization;
    const decodedToken = await decodeToken(userToken);
    const user = await userSchema.findOne({ _id: decodedToken.data.id });

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
    const users = await userSchema.find();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: "Error fetching users" });
  }
});

router.patch("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, status } = req.body;

    const user = await userSchema.findOne({ _id: id });

    if (!user) return res.status(404).send({ message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    return res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).send({ error: "Error updating user" });
  }
});

module.exports = router;