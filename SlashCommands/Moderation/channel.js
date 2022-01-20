const { Client, MessageEmbed, CommandInteraction } = require("discord.js");


module.exports = {
  name: "channel",
  description: `Take an action on a channel!`,
  permissions: ["BAN_MEMBERS"],
  options: [
    {
      name: "lock",
      description: "Locks a channel!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description: "The channel you want to lock!",
          required: true,
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT", "GUILD_VOICE", "GUILD_STAGE_VOICE"],
        },
        {
          name: "reason",
          description: "The reason of the lock!",
          required: true,
          type: "STRING",
        }
      ]

    },
    {
      name: "unlock",
      description: "Unlocks a channel!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description: "The channel you want to lock!",
          required: true,
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT", "GUILD_VOICE", "GUILD_STAGE_VOICE"],
        },
        {
          name: "reason",
          description: "The reason of the lock!",
          required: false,
          type: "STRING",
        }
      ]

    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction) => {

    const subs = interaction.options.getSubcommand(["lock", "unlock"])

    if (subs == "lock") {

      const channel = interaction.options.getChannel("channel")
      const reason = interaction.options.getString("reason")

      if (channel.type === "GUILD_VOICE" || channel.type === "GUILD_STAGE_VOICE") {

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          CONNECT: false
        });

        await interaction.followUp({ content: "Channel Locked!" })

      } else if (channel.type === "GUILD_TEXT") {

        let msg = await interaction.followUp({ content: "Locking the channel..." })

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SEND_MESSAGES: false
        });

        var hii = new MessageEmbed()
          .setAuthor({ name: "Channel Locked", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setDescription("This channel was locked by a staff member.\nPlease don't dm any staff members about this, __you are not muted__.\n")
          .setColor(`${client.color.moderation}`)
          .setTimestamp()
          .addFields({
            name: "Reason",
            value: reason
          })

        await channel.send({ embeds: [hii] })
        await msg.edit({ content: "Channel Locked!" })

      }

    } else if (subs == "unlock") {

      const channel = interaction.options.getChannel("channel")
      const reason = interaction.options.getString("reason") || "No reason provided"

      if (channel.type === "GUILD_VOICE" || channel.type === "GUILD_STAGE_VOICE") {

        const msg = await interaction.followUp({ content: "Unlocked The Channel!" })

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          CONNECT: null
        });

        await msg.edit({ content: `Unlocked ${channel}` })


      } else if (channel.type === "GUILD_TEXT") {

        let msg = await interaction.followUp({ content: "Unlocking the channel..." })

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SEND_MESSAGES: null
        });

        var hii = new MessageEmbed()
          .setAuthor({ name: "Channel Unlocked", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setDescription("This channel has been Unlocked by a staff member.")
          .setColor(`${client.color.moderation}`)
          .addFields({
            name: "Reason",
            value: reason
          })

          .setTimestamp()

        await channel.send({ embeds: [hii] })
        await msg.edit({ content: "Channel Unlocked!" })


      }
    }


  }
}