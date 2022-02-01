const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const ms = require("ms")
const db = require("../../models/MemberRoles.js")
require("../../structures/guildMember/mute")

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
  run: async (client, interaction) => {

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
        return interaction.followUp({ embeds: [client.util.embed.cannotPerform] })
          .then(() => {
            client.util.delete.interaction(interaction)
          })


      if (!interaction.guild.roles.cache.get(`${client.server.mutedRole}`)) {
        const Server = client.guilds.cache.get(`${client.server.id}`);
        const embed = new MessageEmbed()
          .setDescription(`I couldn't find the muted role! Are you running the command in [${Server.name}](${client.server.invite})?`)
          .setColor("RED")
        return interaction.followUp({ embeds: [embed] }).then(() => {
          client.util.delete.interaction(interaction);
        })
      };

      if (user.isCommunicationDisabled() == true) {
        const embed = new MessageEmbed()
          .setDescription(`This user is already muted!`)
          .setColor("RED")

        return interaction.followUp({ embeds: [embed] })
          .then(() => {
            client.util.delete.interaction(interaction);
          })
      };

      if (ms(time) === undefined) {
        const embed = new MessageEmbed()
          .setDescription(`I couldn't find out the duration of this mute!`)
          .setColor("RED")
        return interaction.followUp({ embeds: [embed] }).then(() => {
          client.util.delete.interaction(interaction);
        })

      };

      if (ms(time) > 2332800000) {
        const embed = new MessageEmbed()
          .setDescription(`You can't mute users for more than 27 days!`)
          .setColor("RED")
        return interaction.followUp({ embeds: [embed] }).then(() => {
          client.util.delete.interaction(interaction);
        })

      };

      await user.mute({
        duration: time,
        msg: interaction,
        reason: reason,
        auto: false
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
              client.util.delete.interaction(interaction);
            })
        }
      })
    }
  }
}
