const { MessageEmbed, Message, Client } = require('discord.js')
const ms = require("ms")
const db = require("../../models/MemberRoles.js")
const warnModel = require("../../models/Punishments.js")

module.exports = {
  name: 'mute',
  category: 'moderation',
  description: `Mutes a user`,
  usage: "[user] <time> <reason>",
  cooldown: 3000,
  permissions: ["MANAGE_MESSAGES"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, wrongUsage) => {

    var user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
    let time = args[1];
    if (!args[1]) time = "6h";
    let reason = message.content.split(" ").slice(3).join(" ") || "No reason provided"

    if (!args[0]) return message.reply({ embeds: [wrongUsage] })

    let userNotFound = new MessageEmbed()
      .setDescription("This user isn't in this guild!")
      .setColor(`RED`)
    if (!user) return message.reply({ embeds: [userNotFound] }).then((msg) => {
      client.delete.message(message, msg);
    })

    if (user.roles.highest.position >= message.guild.me.roles.highest.position ||
      user.roles.highest.position >= message.member.roles.highest.position ||
      user.user.id === client.config.owner ||
      user.user.bot)
      return message.reply({ embeds: [client.embeds.cannotPerform] }).then((msg) => {
        client.delete.message(message, msg);
      })

    if (user.roles.cache.some(role => role.id === '795353284042293319')) {

      const embed = new MessageEmbed()
        .setDescription(`This user is already muted!`)
        .setColor("RED")
      return message.reply({ embeds: [embed] }).then((msg) => {
        client.delete.message(message, msg);
      })
    }

    if (ms(time) === undefined) {

      const embed = new MessageEmbed()
        .setDescription(`I couldn't find out the duration of this mute!`)
        .setColor("RED")

      return message.reply({ embeds: [embed] }).then((msg) => {
        client.delete(message, msg);
      })

    }

    const data = new db({
      guildid: message.guild.id,
      user: user.user.id,
      roles: [user.roles.cache.filter(e => e.id !== message.guild.id).map(role => role.id)],
      reason: "Muted by a moderator"
    })
    data.save()

    const data2 = new warnModel({
      type: "Mute",
      userId: user.user.id,
      guildId: message.guild.id,
      moderatorId: message.author.id,
      reason,
      timestamp: Date.now(),
      systemExpire: Date.now() + ms("26 weeks")
    })
    data2.save()
    user.roles.set([`${client.server.mutedRole}`])

    let mue = new MessageEmbed()
      .setDescription(`${user.user} has been **muted** | \`${data2._id}\``)
      .setColor(`${client.color.moderation}`)
    let msg = await message.channel.send({ embeds: [mue] }).then(message.delete())

    var duration = ms(time)
    let mm = new MessageEmbed()
      .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`You've been Muted in ${message.guild.name}`)
      .setColor(`${client.color.modDm}`)
      .setTimestamp()
      .addField("Punishment ID", `${data2._id}`, true)
      .addField("Duration", `${ms(duration, { long: true })}`, true)
      .addField("Reason", `${reason}`, false)
    user.send({ embeds: [mm] }).catch(e => { return })


    client.log.action({
      type: `${ms(duration, { long: true })} Of Mute`,
      color: "MUTE",
      user: `${user.user.id}`,
      moderator: `${message.author.id}`,
      reason: `${reason}`,
      id: `${data2._id}`,
      url: `https://discord.com/channels/${message.guildId}/${message.channelId}/${msg.id}`
    })

    setTimeout(async () => {

      const findmember = message.guild.members.cache.get(`${user.user.id}`)

      client.log.autoAction({
        type: "Unmute",
        color: "UNMUTE",
        user: `${user.user.id}`,
        reason: `Temp Muted for ${ms(duration, { long: true })} By a moderator`
      })

      if (findmember) {

        db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
          if (err) throw err;
          if (data) {

            data.roles.map((w, i) => user.roles.set(w))
            await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })

          }
        })

      } else if (!findmember) {

        const leftroles = require("../../models/LeftMembers.js")

        db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
          if (err) throw err;
          if (data) {

            leftroles.findOneAndUpdate({ guildid: message.guild.id, user: `${user.user.id}` }, { $set: { roles: [data.roles.map(e => e)] } })
            await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })

          }
        })
      }

    }, ms(time))

  }
}
