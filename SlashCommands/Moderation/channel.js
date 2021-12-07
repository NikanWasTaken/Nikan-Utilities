const { Client, CommandInteraction, Message, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");


module.exports = {
  name: "channel",
  description: `Take an action on a channel!`,
  userPermissions: ["BAN_MEMBERS"],
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
          channelTypes: ["GUILD_TEXT", "GUILD_VOICE"],
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
          channelTypes: ["GUILD_TEXT", "GUILD_VOICE"],
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
  run: async (client, interaction, args) => {

    const subs = interaction.options.getSubcommand(["lock", "unlock"])

    if (subs == "lock") {

      const channel = interaction.options.getChannel("channel")
      const reason = interaction.options.getString("reason")

      if (channel.type === "GUILD_VOICE") {

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          CONNECT: false
        });

        let msg2 = await interaction.followUp({ content: "Channel Locked!" })


      } else {

        let msg = await interaction.followUp({ content: "Locking the channel..." })

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SEND_MESSAGES: false
        });

        var hii = new MessageEmbed()
          .setAuthor("Channel Locked", client.user.displayAvatarURL({ dynamic: true }))
          .setDescription("This channel has been locked by a staff member. You are not muted.\nMore information will be sent here eventually.")
          .setColor(`${client.color.moderation}`)
          .setTimestamp()
          .addFields({
            name: "Reason",
            value: reason
          })

        await msg.edit({ content: "Channel Locked!" })

        await channel.send({ embeds: [hii] })


      }

    } else if (subs == "unlock") {

      const channel = interaction.options.getChannel("channel")
      const reason = interaction.options.getString("reason") || "No reason provided"

      if (channel.type === "GUILD_VOICE") {


        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          CONNECT: null
        });

        await interaction.followUp({ content: "Unlocked The Channel!" })


      } else {

        let msg = await interaction.followUp({ content: "Unlocking the channel..." })

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SEND_MESSAGES: null
        });

        var hii = new MessageEmbed()
          .setAuthor("Channel Unlocked", client.user.displayAvatarURL({ dynamic: true }))
          .setDescription("This channel has been Unlocked by a staff member.\nYou may start chatting now!")
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