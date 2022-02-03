const { MessageEmbed, Client, Message, MessageActionRow, MessageButton } = require("discord.js");
const warnModel = require("../../models/Punishments.js");
const ms = require("ms")
require("../../structures/GuildMember/mute")
require("../../structures/GuildMember/warn")


module.exports = {
  name: 'warn',
  category: 'moderation',
  description: `Warns a user in the server`,
  usage: '[user] [reason]',
  cooldown: 3000,
  permissions: ["MANAGE_MESSAGES"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, wrongUsage) => {

    const user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
    const reason = args.slice(1).join(" ")

    if (!args[0] || !reason) return wrongUsage(message)

    if (!user) {
      const embed = new MessageEmbed()
        .setDescription(`This user is not in this guild!`)
        .setColor("RED")
      message.reply({ embeds: [embed] }).then((msg) => {
        client.util.delete.message(message, msg)
      })
    }

    if (user.roles.highest.position >= message.guild.me.roles.highest.position ||
      user.roles.highest.position >= message.member.roles.highest.position ||
      user.user.id === client.config.owner ||
      user.user.bot
    )
      return message.reply({ embeds: [client.util.embed.cannotPerform] }).then((msg) => {
        setTimeout(() => {
          msg?.delete()
          message?.delete()
        }, 5000)
      })

    user.warn({
      reason: reason,
      msg: message
    })

    // ---- checks for warns and mutes

    const userWarnings = await warnModel.find({
      userId: user.user.id,
      guildId: message.guild.id,
      type: "Warn",
    });

    const numberofwarns = [];
    userWarnings.map((i) => {
      numberofwarns.push(`${i + 1}`)
    })


    if (numberofwarns.length == 2) {

      await user.mute({
        duration: "2h",
        msg: message,
        reason: reason,
        auto: true
      })

    } else if (numberofwarns.length == 4) {

      await user.mute({
        duration: "6h",
        msg: message,
        reason: reason,
        auto: true
      })

    } else if (numberofwarns.length == 6) {

      await user.Ban({
        msg: message,
        reason: "Reaching 6 strikes",
        auto: true
      })

    }
  },
};