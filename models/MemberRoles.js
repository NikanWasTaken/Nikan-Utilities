const mongoose = require("mongoose")

let Schema = new mongoose.Schema({
    guildId: String,
    userId: String,
    roles: Array,
    until: Number,
})

module.exports = mongoose.model('mutedRoles', Schema)