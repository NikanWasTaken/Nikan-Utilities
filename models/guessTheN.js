const mongoose = require("mongoose");


    module.exports = mongoose.model(
        "GuessTheNumber",
        new mongoose.Schema({
            range: String,
            correctNumber: String,
            hostId: String,
            guildId: String,
            prize: String,
            channelId: String,
            status: String,
        })
    );
