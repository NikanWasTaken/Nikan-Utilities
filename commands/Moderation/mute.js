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

  run: async (client, message, args, missingpartembed) => {


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
      user.user.id === client.config.owner ||
      user.user.bot)
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

    user.roles.set(["795353284042293319"])

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


    const log = new MessageEmbed()
      .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
      .setTitle(`➜ ${ms(duration, { long: true })} Of Mute`).setURL(`${client.server.invite}`)
      .setColor(`${client.color.mute}`)
      .addField("➜ User", `• ${user.user}\n• ${user.user.tag}\n• ${user.user.id}`, true)
      .addField("➜ Moderator", `• ${message.author}\n• ${message.author.tag}\n• ${message.author.id}`, true)
      .addField("➜ Reason", `${reason}`, false)
      .setFooter(`ID: ${data._id}`)

    const rowlog = new MessageActionRow().addComponents(

      new MessageButton()
        .setLabel("Jump to the action")
        .setStyle("LINK")
        .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

    )

    client.webhook.moderation.send({ embeds: [log], components: [rowlog] }).then(


      setTimeout(async () => {

        const findmember = message.guild.members.cache.get(`${user.user.id}`)

        const warns2 = new MessageEmbed()
          .setAuthor(`Automatic Actions`, `${client.user.displayAvatarURL()}`)
          .setColor(`${client.color.mute}`)
          .setTitle(`➜ Unmute After Tempmute`).setURL(`${client.server.invite}`)
          .addField("User", `• ${await client.users.fetch(`${user.user.id}`) || "I couldn't find them!"}`, true)
          .addField("User Tag", `• ${(await client.users.fetch(`${user.user.id}`)).tag || "I couldn't find them!"}`, true)
          .addField("User ID", `• ${(await client.users.fetch(`${user.user.id}`)).id || "I couldn't find them!"}`, true)
          .addField("Reason", `Unmuted after a ${ms(duration, { long: true })} of tempmute!`)

        client.webhook.autoaction.send({ embeds: [warns2] })

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

              leftroles.findOneAndUpdate({ guildid: message.guild.id, user: `${user.user.id}` }, { $set: { roles: [data.roles.map(e => e)] } }, async (data, err) => { })
              await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })

            }
          })
        }

      }, ms(time))

    )


  }
}
