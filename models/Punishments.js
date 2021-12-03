const mongoose = require("mongoose");


module.exports = mongoose.model(
  "punishments",
  new mongoose.Schema({
    type: String,
    userId: String,
    guildId: String,
    moderatorId: String,
    reason: String,
    timestamp: Number,
    expires: Number
  })
);