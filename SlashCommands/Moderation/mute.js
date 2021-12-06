const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ms = require("ms")
const db = require("../../models/MemberRoles.js")
const warnModel = require("../../models/Punishments.js")

module.exports = {
  name: "mute",
  description: `Mutes a member in the server!`,
  userPermissions: ["MANAGE_MESSAGES"],
  options: [
    {
      name: "add",
      description: "Mutes a member for a specific time!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you want to mute!",
          required: true,
          type: "USER",

        },
        {
          name: "duration",
          description: "The duration that you want to mute the user.",
          required: false,
          type: "STRING",

        },
        {
          name: "reason",
          description: "The reason of the mute!",
          required: false,
          type: "STRING",

        }
      ]
    },
    {
      name: "remove",
      description: "Unmutes a member!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you want to unmute!",
          required: true,
          type: "USER",
        }
      ]

    }
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {

    const subs = interaction.options.getSubcommand(["add", "remove"])


    if (subs == "add") {

      var user = interaction.options.getMember("user")
      let time = interaction.options.getString("duration")
      if (!time) time = "6h"
      let reason = interaction.options.getString("reason") || "No reason provided"

      const failed = new MessageEmbed().setDescription(`You don't have permissions to perform that action!`).setColor("RED")

      if (user.roles.highest.position >= interaction.guild.me.roles.highest.position ||
        user.roles.highest.position >= interaction.member.roles.highest.position ||
        user.user.id === client.config.owner ||
        user.user.bot)
        return interaction.followUp({ embeds: [failed] }).then((msg) => {
          setTimeout(() => {
            interaction.deleteReply()
          }, 5000)
        })

      if (user.roles.cache.some(role => role.id === '795353284042293319')) {

        const embed = new MessageEmbed().setDescription(`This user is already muted!`).setColor("RED")
        return interaction.followUp({ embeds: [embed] }).then((msg) => {
          setTimeout(() => {
            interaction.deleteReply()
          }, 5000)
        })

      }

      if (ms(time) === undefined) {

        const embed = new MessageEmbed().setDescription(`I couldn't find out the duration of this mute!`).setColor("RED")
        return interaction.followUp({ embeds: [embed] }).then((msg) => {
          setTimeout(() => {
            interaction.deleteReply()
          }, 5000)
        })

      }

      const data = new db({
        guildid: interaction.guild.id,
        user: user.user.id,
        roles: [user.roles.cache.map(role => role.id)],
        reason: "Muted by a moderator"
      })
      data.save()

      const data2 = new warnModel({
        type: "Mute",
        userId: user.user.id,
        guildId: interaction.guildId,
        moderatorId: interaction.user.id,
        reason,
        timestamp: Date.now(),
        expires: Date.now() + ms('4 weeks'),
      })
      data2.save()

      await user.roles.set(["795353284042293319"])

      let mue = new MessageEmbed()
        .setDescription(`${user.user} has been **muted** | \`${data2._id}\``)
        .setColor(`${client.embedColor.moderation}`)
      interaction.deleteReply()
      let msg = await interaction.channel.send({ embeds: [mue] })

      var duration = ms(time)

      let mm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`You've been Muted in ${interaction.guild.name}`)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
        .addField("Punishment ID", `${data2._id}`, true)
        .addField("Duration", `${ms(duration, { long: true })}`, true)
        .addField("Reason", `${reason}`, false)
      user.send({ embeds: [mm] }).catch(e => { return })


      let log = new MessageEmbed()
        .setAuthor(`Moderation • Mute`, interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`** **`)
        .setColor(`${client.embedColor.logs}`)
        .addField('👥 User', `Mention • ${user.user}\nTag • ${user.user.tag}\nID • ${user.user.id}`, true)
        .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${interaction.user}\nTag • ${interaction.user.tag}\nID • ${interaction.user.id}`, true)
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

      client.webhook.moderation.send({ embeds: [log], components: [rowlog] })


      setTimeout(async () => {

        const findmember = interaction.guild.members.cache.get(`${user.user.id}`)

        if (findmember) {

          db.findOne({ guildid: interaction.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {

              data.roles.map((w, i) => user.roles.set(w))
              await db.findOneAndDelete({ user: user.user.id, guildid: interaction.guild.id })

            }
          })


        } else if (!findmember) {

          const leftroles = require("../../models/LeftMembers.js")

          db.findOne({ guildid: interaction.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {

              leftroles.findOneAndUpdate({ guildid: interaction.guild.id, user: `${user.user.id}` }, { $set: { roles: [data.roles.map(e => e)] } }, async (data, err) => { })
              await db.findOneAndDelete({ user: user.user.id, guildid: interaction.guild.id })

            }
          })
        }

      }, ms(time))

    } else if (subs == "remove") {

      var user = interaction.options.getMember("user")


      db.findOne({ guildid: interaction.guild.id, user: user.user.id }, async (err, data) => {
        if (err) throw err;
        if (data) {

          data.roles.map((w, i) => user.roles.set(w))
          await db.findOneAndDelete({ user: user.user.id, guildid: interaction.guild.id })

          let mue = new MessageEmbed()
            .setDescription(`${user.user} has been **unmuted**`)
            .setColor(`${client.embedColor.moderation}`)
          interaction.deleteReply()
          let msg = await interaction.followUp({ embeds: [mue] })


          let log = new MessageEmbed()
            .setAuthor(`Moderation • Unmute`, message.guild.iconURL({ dynamic: true }))
            .setDescription(`** **`)
            .setColor(`${client.embedColor.logs}`)
            .addField('👥 User', `Mention • ${user.user}\nTag • ${user.user.tag}\nID • ${user.user.id}`, true)
            .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${interaction.user}\nTag • ${interaction.user.tag}\nID • ${interaction.user.id}`, true)
            .addField("Reason", `${reason}`, false)
            .setTimestamp()

          const rowlog = new MessageActionRow().addComponents(

            new MessageButton()
              .setLabel("Jump to the action")
              .setStyle("LINK")
              .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

          )

          client.webhook.moderation.send({ embeds: [log], components: [rowlog] })

        } else {

          const embed = new MessageEmbed().setDescription(`This user is not muted!`).setColor("RED")
          return interaction.followUp({ embeds: [embed] }).then((msg) => {
            setTimeout(() => {
              interaction.deleteReply()
            }, 5000)
          })

        }


      })

    }

  }
}
