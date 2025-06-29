const mongoose = require("mongoose");

const questSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    reward: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward' },
    levelRequirement: { type: Number, default: 1 },
});

module.exports = mongoose.model('Quest', questSchema);