const mongoose = require("mongoose");

const studentStatisticSchema = new mongoose.Schema({
    user_id: { type: String, required: true }, // Storing as String as it's a UUID from Supabase
    event_type: { type: String, required: true },
    event_data: { type: mongoose.Schema.Types.Mixed }, // Flexible schema for event data
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StudentStatistic', studentStatisticSchema);