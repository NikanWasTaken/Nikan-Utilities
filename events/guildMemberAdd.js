const client = require("../index.js")
const config = require('../config.json')
const prefix = config.prefix



client.on('guildMemberAdd', async user => {
    let channel = user.guild.channels.cache.get("782837655082631229")
   
    user.roles.add("793410990535999508")
    channel.send(`${user}, Welcome to **${user.guild.name}**.`)
   
   })