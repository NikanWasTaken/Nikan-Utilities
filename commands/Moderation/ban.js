const { MessageEmbed, Message, Client } = require('discord.js');
let isBanned = false;
require("../../structures/User/ban")
require("../../structures/GuildMember/ban")

module.exports = {
  name: 'ban',
  category: 'moderation',
  description: 'Bans a member from the server',
  usage: `[user] <reason>`,
  cooldown: 2000,
  permissions: ["BAN_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, wrongUsage) => {

    let reason = message.content.split(" ").slice(2).join(" ") || "No reason provided"
    if (!args[0]) return wrongUsage(message)
    let user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()

    if (!user) {

      await message.guild.bans.fetch()
        .then(async (bans) => {
          const BannedUser = bans.find(b => b.user.id === `${args[0]}`)
          if (BannedUser) {
            isBanned = true;
          }
        })

      const alreadyBanned = new MessageEmbed()
        .setDescription("This user is aready banned from the server!")
        .setColor("RED")
      if (isBanned !== false)
        return message.reply({
          embeds: [alreadyBanned]
        }).then((msg) => client.util.delete.message(message, msg))

      var userFetch = await client.users.fetch(`${args[0]}`).catch(() => { })
      const embed = new MessageEmbed()
        .setDescription("This user doesn't exist")
        .setColor("RED")
      if (!userFetch) return message.reply({ embeds: [embed] })
        .then((msg) => client.util.delete.message(message, msg))

      userFetch.Ban({
        auto: false,
        reason: reason,
        msg: message
      })

    } else {

      if (user.roles.highest.position >= message.guild.me.roles.highest.position ||
        user.roles.highest.position >= message.member.roles.highest.position ||
        user.user.id === client.config.owner ||
        user.user.bot
      ) return message.reply({ embeds: [client.util.embed.cannotPerform] })
        .then((msg) => client.util.delete.message(message, msg))

      user.Ban({
        auto: false,
        reason: reason,
        msg: message
      })
    }
  }
}