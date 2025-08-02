const mongoose = require("mongoose");
const { mongodbString } = require("../config");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongodbString);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectMongoDB;