const mongoose = require("mongoose")


let Schema = new mongoose.Schema({
    guildId: String,
    userId: String,
    roles: Array,
    expires: Number,
})

module.exports = mongoose.model('LeftRoles', Schema)