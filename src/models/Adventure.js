const mongoose = require("mongoose");

const adventureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    quests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Adventure', adventureSchema);