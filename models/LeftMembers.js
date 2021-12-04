const mongoose = require("mongoose")


let Schema = new mongoose.Schema({
    guildid: String,
    user: String,
    roles: Array,
    expires: Number,
})


module.exports = mongoose.model('LeftMemberRoles', Schema)