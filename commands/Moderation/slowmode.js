const { MessageEmbed } = require('discord.js')
const ms = require("ms")

module.exports = {
    name : 'slowmode',
    category : 'moderation',
    description : `Changes a channel's slowmode`,
    usage:'[limit in second]',
    aliases : ['sm'],
    cooldown: 3000,
    userPermissions: ["MANAGE_MESSAGES"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args, missingpartembed, modlog) => {


          if (!args[0]) return message.reply(message.channel.rateLimitPerUser == 0 ? "There is no slowmode on this channel" : `The current slowmode is on **${limit}** seconds.**.`)
          var limit = parseInt(args[0])
          if(limit > 21601) return message.reply("You can't set the slowmode to more than 6 hours!")
          if(limit == message.channel.rateLimitPerUser) return message.reply(`The current slowmode is \`${message.channel.rateLimitPerUser}\` second, Nothing changed.`).then(() => message.channel.setRateLimitPerUser(limit))

          let bru = ms(limit * 1000, { long: true})
          let log = new MessageEmbed()
          .setAuthor(`Action: Slowmode`, message.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
          .setColor(`${client.embedColor.logAqua}`)
          .addField('Channel Info', `● ${message.channel}\n> __Name:__ ${message.channel.name}\n> __ID:__ ${message.channel.id}`, true)
          .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
          .addField("● Slowmode Info", `> Previous Slowmode Rate: **${message.channel.rateLimitPerUser == 0 ? "Slowmode off" : ms(message.channel.rateLimitPerUser * 1000, { long: true})}**\n> New Slowmode Rate: **${limit == 0 ? "Slowmode off" : bru}**`)
          .setTimestamp()
          modlog.send({ embeds: [log]})

          if(limit < 1) return message.reply("Slowmode has been turned off, go crazy!").then(() => message.channel.setRateLimitPerUser("0"))
          message.reply(`${limit < 1 ? "Slowmode has been turned off, go crazy!" : `Slowmode has been set to ` + limit + ' seconds.'}`).then(() => message.channel.setRateLimitPerUser(limit))
          message.channel.setRateLimitPerUser(limit);


    }

}