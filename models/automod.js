const mongoose = require("mongoose");



    let item = mongoose.Schema({
        type: String,
        userId: String,
        guildId: String,
        reason: String,
        date: Number,
     });

    module.exports = mongoose.model('Automod', item)