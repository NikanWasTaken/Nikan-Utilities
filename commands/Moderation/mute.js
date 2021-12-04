const { MessageEmbed, Collection, DataResolver, MessageActionRow, MessageButton } = require('discord.js')
const ms = require("ms")
const db = require("../../models/MemberRoles.js")
const warnModel = require("../../models/Punishments.js")

module.exports = {
  name: 'mute',
  category: 'moderation',
  description: `Mutes a user`,
  usage: "[user] <time> <reason>",
  cooldown: 3000,
  userPermissions: ["MANAGE_MESSAGES"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, missingpartembed, modlog) => {


    var user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
    let time = args[1]
    if (!args[1]) time = "6h"
    let reason = message.content.split(" ").slice(3).join(" ") || "No reason provided"

    if (!args[0]) return message.reply({ embeds: [missingpartembed] })
    let erm = new MessageEmbed().setDescription("This user isn't in this guild!").setColor(`RED`)
    if (!user) return message.reply({ embeds: [erm] }).then((msg) => {
      setTimeout(() => {
        msg?.delete()
        message?.delete()
      }, 5000)
    })

    const failed = new MessageEmbed().setDescription(`You don't have permissions to perform that action!`).setColor("RED")

    if (user.roles.highest.position >= message.guild.me.roles.highest.position ||
      user.roles.highest.position >= message.member.roles.highest.position ||
      user.user.id === client.config.owner)
      return message.reply({ embeds: [failed] }).then((msg) => {
        setTimeout(() => {
          msg?.delete()
          message?.delete()
        }, 5000)
      })

    if (user.roles.cache.some(role => role.id === '795353284042293319')) {

      const embed = new MessageEmbed().setDescription(`This user is already muted!`).setColor("RED")
      return message.reply({ embeds: [embed] }).then((msg) => {
        setTimeout(() => {
          msg?.delete()
          message?.delete()
        }, 5000)
      })

    }

    if (ms(time) === undefined) {

      const embed = new MessageEmbed().setDescription(`I couldn't find out the duration of this mute!`).setColor("RED")
      return message.reply({ embeds: [embed] }).then((msg) => {
        setTimeout(() => {
          msg?.delete()
          message?.delete()
        }, 5000)
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
      expires: Date.now() + ms('4 weeks'),
    })
    data2.save()

    user.roles.set(null).then(
      setTimeout(() => {
        user.roles.add("795353284042293319")
      }, 2000)
    )

    let mue = new MessageEmbed()
      .setDescription(`${user.user} has been **muted** | \`${data2._id}\``)
      .setColor(`${client.embedColor.moderation}`)
    let msg = await message.channel.send({ embeds: [mue] }).then(message.delete())

    var duration = ms(time)

    let mm = new MessageEmbed()
      .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`You've been Muted in ${message.guild.name}`)
      .setColor(`${client.embedColor.modDm}`)
      .setTimestamp()
      .addField("Punishment ID", `${data2._id}`, true)
      .addField("Duration", `${ms(duration, { long: true })}`, true)
      .addField("Reason", `${reason}`, false)
    user.send({ embeds: [mm] }).catch(e => { return })


    let log = new MessageEmbed()
      .setAuthor(`Moderation • Mute`, message.guild.iconURL({ dynamic: true }))
      .setDescription(`** **`)
      .setColor(`${client.embedColor.logs}`)
      .addField('👥 User', `Mention • ${user.user}\nTag • ${user.user.tag}\nID • ${user.user.id}`, true)
      .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${message.author}\nTag • ${message.author.tag}\nID • ${message.author.id}`, true)
      .addField("** **", "** **", true)
      .addField("Punishment ID", `\`${data._id}\``, true)
      .addField("Duration", `${ms(duration, { long: true })}`, true)
      .addField("Reason", `${reason}`, false)
      .setTimestamp()

    const rowlog = new MessageActionRow().addComponents(

      new MessageButton()
        .setLabel("Jump to the action")
        .setStyle("LINK")
        .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

    )

    modlog.send({ embeds: [log], components: [rowlog] }).then(


      setTimeout(async () => {

        const findmember = message.guild.members.cache.get(`${user.user.id}`)

        if (findmember) {

          db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {

              data.roles.map((w, i) => user.roles.set(w).then(user.roles.remove("795353284042293319")))
              await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })

            }
          })


        } else if (!findmember) {

          const leftroles = require("../../models/LeftMembers.js")

          db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {

              leftroles.findOneAndUpdate({ guildid: message.guild.id, user: `${user.user.id}` }, { $set: { roles: [data.roles.map(e => e)] } }, async (data, err) => { })
              await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })

            }
          })
        }

      }, ms(time))

    )


  }
}
