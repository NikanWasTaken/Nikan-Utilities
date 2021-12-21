const mongoose = require("mongoose")


let Schema = new mongoose.Schema({
    guildid: String,
    user: String,
    roles: Array,
    reason: String,
})



module.exports = mongoose.model('memberRoles', Schema)