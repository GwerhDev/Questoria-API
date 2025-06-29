const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    points: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    description: { type: String, required: true },
    items: { type: Array, default: [] },
});

module.exports = mongoose.model('Reward', rewardSchema);