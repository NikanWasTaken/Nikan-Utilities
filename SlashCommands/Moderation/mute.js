const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const ms = require("ms")
const db = require("../../models/MemberRoles.js")
const warnModel = require("../../models/Punishments.js")

module.exports = {
  name: "mute",
  description: `Mutes a member in the server!`,
  permissions: ["MANAGE_MESSAGES"],
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

      if (user.roles.highest.position >= interaction.guild.me.roles.highest.position ||
        user.roles.highest.position >= interaction.member.roles.highest.position ||
        user.user.id === client.config.owner ||
        user.user.bot)
        return interaction.followUp({ embeds: [client.embeds.cannotPerform] })
          .then(() => {
            client.delete.interaction(interaction)
          })


      if (!interaction.guild.roles.cache.get(`${client.server.mutedRole}`)) {
        const Server = client.guilds.cache.get(`${client.server.id}`);
        const embed = new MessageEmbed()
          .setDescription(`I couldn't find the muted role! Are you running the command in [${Server.name}](${client.server.invite})?`)
          .setColor("RED")
        return interaction.followUp({ embeds: [embed] }).then(() => {
          client.delete.interaction(interaction);
        })
      };

      if (user.roles.cache.some(role => role.id === `${client.server.mutedRole}`)) {
        const embed = new MessageEmbed().setDescription(`This user is already muted!`).setColor("RED")
        return interaction.followUp({ embeds: [embed] })
          .then(() => {
            client.delete.interaction(interaction);
          })

      };

      if (ms(time) === undefined) {
        const embed = new MessageEmbed()
          .setDescription(`I couldn't find out the duration of this mute!`)
          .setColor("RED")
        return interaction.followUp({ embeds: [embed] }).then(() => {
          client.delete.interaction(interaction);
        })

      };

      if (ms(time) > 2332800000) {
        const embed = new MessageEmbed()
          .setDescription(`You can't mute users for more than 27 days!`)
          .setColor("RED")
        return interaction.followUp({ embeds: [embed] }).then(() => {
          client.delete.interaction(interaction);
        })

      };

      const duration = ms(time)
      const data = new db({
        guildId: interaction.guildId,
        userId: user.user.id,
        roles: [user.roles.cache.filter(e => e.id !== interaction.guild.id).map(role => role.id)],
        reason: `Temp Muted by a moderator for ${ms(duration, { long: true })}`,
        until: Date.now() + duration
      })
      data.save()

      const data2 = new warnModel({
        type: "Mute",
        userId: user.user.id,
        guildId: interaction.guild.id,
        moderatorId: interaction.user.id,
        reason: reason,
        timestamp: Date.now(),
        systemExpire: Date.now() + ms("26 weeks")
      })
      data2.save()

      await user.roles.set(["795353284042293319"]);
      await user.timeout(duration, `${reason}`);

      let mue = new MessageEmbed()
        .setDescription(`${user.user} has been **muted** | \`${data2._id}\``)
        .setColor(`${client.color.moderation}`)
      await interaction.deleteReply()
      let msg = await interaction.channel.send({ embeds: [mue] })

      let mm = new MessageEmbed()
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
        .setTitle(`You've been Muted in ${interaction.guild.name}`)
        .setColor(`${client.color.modDm}`)
        .setTimestamp()
        .addField("Punishment ID", `${data2._id}`, true)
        .addField("Duration", `${ms(duration, { long: true })}`, true)
        .addField("Reason", `${reason}`, false)
      user.send({ embeds: [mm] }).catch(() => { return })


      client.log.action({
        type: `${ms(duration, { long: true })} Of Mute`,
        color: "MUTE",
        user: `${user.user.id}`,
        moderator: `${interaction.user.id}`,
        reason: `${reason}`,
        id: `${data2._id}`,
        url: `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${msg.id}`
      })


    } else if (subs == "remove") {

      var user = interaction.options.getMember("user")

      db.findOne({ guildId: interaction.guild.id, userId: user.user.id }, async (err, data) => {
        if (err) throw err;
        if (data) {

          data.roles.map((w) => user.roles.set(w))
          await data.delete();

          let mue = new MessageEmbed()
            .setDescription(`${user.user} has been **unmuted**`)
            .setColor(`${client.color.moderation}`)
          await interaction.deleteReply();
          let msg = await interaction.followUp({ embeds: [mue] })

          client.log.action({
            type: "Unmute",
            color: "UNMUTE",
            user: `${user.user.id}`,
            moderator: `${interaction.user.id}`,
            reason: `Unmutes doesn't support reasons.`,
            id: "No ID",
            url: `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${msg.id}`
          })

        } else {

          const embed = new MessageEmbed()
            .setDescription(`This user is not muted!`)
            .setColor("RED")
          return interaction.followUp({ embeds: [embed] })
            .then(() => {
              client.delete.interaction(interaction);
            })
        }
      })
    }
  }
}
