const client = require("../index.js")
const config = require('../config.json')
const Discord = require("discord.js")





client.on("guildMemberAdd", member => {

    const Channel = member.guild.channels.cache.get('791152934045614121')

    const embed = new Discord.MessageEmbed()
    .setAuthor(`Member Joined!`, member.user.displayAvatarURL( { dynamic: true }))
    .setColor("GREEN")
    .setDescription(`${member} has joined ${member.guild.name}.`)
    .addField("Username", member.user.tag, true)
    .addField("Account Creation", member.user.createdAt.toLocaleDateString("en-us"), true)
    .addField("Avatar", `[**Click Here**](${member.user.avatarURL()})`, true)
    .addField("Member Count", member.guild.members.cache.size, true)
    .addField("Humans Count", member.guild.members.cache.filter(member => !member.user.bot).size, true)
    .setFooter(`${member.guild.name} | +1 member :D`)
    .setTimestamp()

    Channel.send(embed)


})

client.on("guildMemberRemove", member => {

    const Channel = member.guild.channels.cache.get('791152934045614121')

    const embed = new Discord.MessageEmbed()
    .setAuthor(`Member Left!`, member.user.displayAvatarURL( { dynamic: true }))
    .setColor("RED")
    .setDescription(`${member} has left ${member.guild.name}.`)
    .addField("Username", member.user.tag, true)
    .addField("Member Joined", member.joinedAt.toLocaleDateString("en-us"), true)
    .addField("Avatar", `[**Click Here**](${member.user.avatarURL()})`, true)
    .addField("Member Count", member.guild.members.cache.size, true)
    .addField("Humans Count", member.guild.members.cache.filter(member => !member.user.bot).size, true)
    .setFooter(`${member.guild.name} | -1 member :C`)
    .setTimestamp()

    Channel.send(embed)
    

})
