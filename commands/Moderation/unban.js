const { MessageEmbed, Client, Message } = require('discord.js')
const warnModel = require("../../models/Punishments.js")
const ms = require("ms");

module.exports = {
  name: 'unban',
  category: 'moderation',
  description: 'Unbans a banned member from the server',
  usage: '[user ID] <reason>',
  aliases: ['deban'],
  cooldown: 5000,
  permissions: ["MOVE_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, wrongUsage) => {

    if (!args[0]) return wrongUsage(message)
    let userID = args[0]
    let reason = message.content.split(" ").slice(2).join(" ") || "No reason provided"

    message.guild.bans.fetch().then(async bans => {

      let BannedUser = bans.find(b => b.user.id == userID)

      const nomemberfound = new MessageEmbed()
        .setDescription(`This user is not banned from the server!`)
        .setColor(`RED`)

      if (!BannedUser)
        return message.reply({ embeds: [nomemberfound] }).then((msg) => {
          client.delete.message(message, msg);
        })

      message.guild.members.unban(BannedUser.user)

      const data = new warnModel({
        type: "Unban",
        userId: userID,
        guildId: message.guildId,
        moderatorId: message.author.id,
        reason: reason,
        timestamp: Date.now(),
        systemExpire: Date.now() + ms("26 weeks")
      })
      data.save()

      var pop = new MessageEmbed()
        .setDescription(`**${BannedUser.user.tag}** has been **unbanned** | \`${data._id}\``)
        .setColor(`${client.color.moderation}`)
      let msg = await message.channel.send({ embeds: [pop] }).then(message.delete())


      client.log.action({
        type: "Unban",
        color: "UNBAN",
        user: `${BannedUser.user.id}`,
        moderator: `${message.author.id}`,
        reason: `${reason}`,
        id: `${data._id}`,
        url: `https://discord.com/channels/${message.guildId}/${message.channelId}/${msg.id}`
      })

    })
  }
}

