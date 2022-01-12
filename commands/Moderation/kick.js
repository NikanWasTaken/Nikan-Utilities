const { MessageEmbed, Message, Client } = require('discord.js')
const warnModel = require("../../models/Punishments.js")
const ms = require("ms")

module.exports = {
  name: 'kick',
  category: 'moderation',
  description: 'Kicks a user from the server.',
  usage: `[user] <reason>`,
  cooldown: 3000,
  permissions: ["KICK_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, wrongUsage) => {

    var user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
    if (!args[0]) return message.reply({ embeds: [wrongUsage] })
    var reason = message.content.split(" ").slice(2).join(" ") || "No reason provided"

    let userNotFound = new MessageEmbed()
      .setDescription(`This user is not in this guild!`)
      .setColor(`RED`)

    if (!user) return message.reply({ embeds: [userNotFound] }).then((msg) => {
      client.delete.message(message, msg);
    })

    if (user.roles.highest.position >= message.guild.me.roles.highest.position ||
      user.roles.highest.position >= message.member.roles.highest.position ||
      user.user.id === client.config.owner ||
      user.user.bot)
      return message.reply({ embeds: [client.embeds.cannotPerform] })
        .then((msg) => client.delete.message(message, msg))

    const data = new warnModel({
      type: "Kick",
      userId: user.user.id,
      guildId: message.guild.id,
      moderatorId: message.author.id,
      reason,
      timestamp: Date.now(),
      systemExpire: Date.now() + ms("26 weeks")
    })
    data.save();

    const embed = new MessageEmbed()
      .setDescription(`${user.user} has been **kicked** | \`${data._id}\``)
      .setColor(`${client.color.moderation}`)
    let msg = await message.channel.send({ embeds: [embed] }).then(message.delete())


    var dmyes = new MessageEmbed()
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setTitle(`You've been kicked from ${message.guild.name}`)
      .setColor(`${client.color.modDm}`)
      .setTimestamp()
      .addField("Punishment ID", `${data._id}`, true)
      .addField("Reason", reason, false)
    user.send({ embeds: [dmyes] }).catch(() => { return })

    user.kick({
      reason: reason,
    })

    client.log.action({
      type: "Kick",
      color: "KICK",
      user: `${user.user.id}`,
      moderator: `${message.author.id}`,
      reason: `${reason}`,
      id: `${data._id}`,
      url: `https://discord.com/channels/${message.guildId}/${message.channelId}/${msg.id}`
    })

  }
}