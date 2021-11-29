const { MessageEmbed, Collection, DataResolver } = require('discord.js')
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
    let time = args[1] || "6h"
    let reason = message.content.split(" ").slice(3).join(" ") || "No reason provided"

    if (!args[0]) return message.reply({ embeds: [missingpartembed] })
    let erm = new MessageEmbed().setDescription(`${client.botEmoji.failed} Can't find that user!`).setColor(`${client.embedColor.failed}`)
    if (!user) return message.reply({ embeds: [erm] })

    let xxpermuser = new MessageEmbed().setDescription(`${client.botEmoji.failed} You can't mute that user as they are mod/admin.`).setColor(`${client.embedColor.failed}`)
    let xxpermbot = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't mute that user as their roles are higher then me.`).setColor(`${client.embedColor.failed}`)
    if (user.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [xxpermbot] })
    if (user.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [xxpermuser] })

    if (!user.roles.cache.some(role => role.id === '795353284042293319')) {

      const data = new db({
        guildid: message.guild.id,
        user: user.user.id,
        content: [{ roles: user.roles.cache.map(role => role.id), reason: "Collecting the roles after the mute!" }]
      })

      data.save()

      const data2 = new warnModel({
        type: "Mute",
        userId: user.user.id,
        guildId: message.guild.id,
        moderatorId: message.author.id,
        reason,
        timestamp: Date.now(),
      })

      data2.save()

      user.roles.set(null).then(
        setTimeout(() => {
          user.roles.add("795353284042293319")
        }, 3000)
      )

      let mue = new MessageEmbed()
        .setDescription(`${user.user} has been **muted** | \`${data2._id}\``)
        .setColor(`${client.embedColor.moderation}`)
      message.channel.send({ embeds: [mue] }).then(message.delete())

      var duration = ms(time)

      let mm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`You've been Muted in ${message.guild.name}`)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
        .setFooter(`Server ID: ${message.guild.id}`)
        .addField("Punishment ID", `${data2._id}`, true)
        .addField("Duration", `${ms(duration, { long: true })}`, true)
        .addField("Reason", `${reason}`, false)
      user.send({ embeds: [mm] }).catch(e => { return })


      let log = new MessageEmbed()
        .setAuthor(`Action: Mute`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
        .addField("● Mute Info", `> Reason: ${reason}\n> Duration: ${ms(duration, { long: true })}\n> Punishment ID: ${data2._id}`)
        .setTimestamp()
      modlog.send({ embeds: [log] })

    } else {
      let uu = new MessageEmbed().setDescription(`${client.embedColor.failed} That user is already muted.`).setColor(`${client.embedColor.failed}`)
      message.reply({ embeds: [uu] })
    }


    setTimeout(async () => {

      db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
        if (err) throw err;
        if (data) {
          data.content.map((w, i) => user.roles.set(w.roles).then(user.roles.remove("795353284042293319")))
          await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })
        }
      })

      let log = new MessageEmbed()
        .setAuthor(`Action: Unmute`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setColor(`${client.embedColor.logGreen}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("● Mod Info", `> Mute: ${message.author}\n> Unmute: Auto`, true)
        .addField("● Mute Info", `> Reason: ${reason}\n> Unmuted After ${ms(duration, { long: true })}`)
        .setTimestamp()

      modlog.send({ embeds: [log] })

    }, ms(time))


  }
}
