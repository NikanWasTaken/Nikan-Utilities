const mongoose = require("mongoose")


let Schema = new mongoose.Schema({
    guildId: String,
    userId: String,
    roles: Array,
    reason: String,
    until: Number,
})



module.exports = mongoose.model('memberRoles', Schema)