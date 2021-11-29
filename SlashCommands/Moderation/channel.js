const { Client, CommandInteraction, Message, MessageEmbed } = require("discord.js");
const ms = require("ms")



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
  run: async (client, interaction, args, modlog) => {

    const subs = interaction.options.getSubcommand(["lock", "unlock"])

    if (subs == "lock") {

      const channel = interaction.options.getChannel("channel")
      const reason = interaction.options.getString("reason")

      if (channel.type === "GUILD_VOICE") {

        var hoy = new MessageEmbed()
          .setDescription(`Locked the voice channel ${channel} for the reason: ${reason}`)
          .setColor(`${client.embedColor.moderation}`)

        interaction.followUp({ embeds: [hoy] })

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          CONNECT: false
        });

        let log = new MessageEmbed()
          .setAuthor(`Action: Channel Lock`, interaction.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
          .setColor(`${client.embedColor.logYellow}`)
          .addField('Channel Info', `● ${channel}\n> __Name:__ ${channel.name}\n> __ID:__ ${channel.id}`, true)
          .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
          .addField("● Lock Info", `> Reason: ${reason}`)
          .setTimestamp()
        modlog.send({ embeds: [log] })

      } else {

        let msg = await interaction.followUp({ content: "Locking the channel..." })

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SEND_MESSAGES: false
        });

        var hii = new MessageEmbed()
          .setAuthor("Channel Locked", client.user.displayAvatarURL({ dynamic: true }))
          .setDescription("This channel has been locked by a staff member. You are not muted.\nMore information will be sent here eventually.")
          .setColor(`${client.embedColor.moderation}`)
          .setTimestamp()
          .addFields({
            name: "Reason",
            value: reason
          })

        channel.send({ embeds: [hii] })

        await msg.edit({ content: "Channel Locked!" })


        let log = new MessageEmbed()
          .setAuthor(`Action: Channel Lock`, interaction.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
          .setColor(`${client.embedColor.logYellow}`)
          .addField('Channel Info', `● ${channel}\n> __Name:__ ${channel.name}\n> __ID:__ ${channel.id}`, true)
          .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
          .addField("● Lock Info", `> Reason: ${reason}`)
          .setTimestamp()
        modlog.send({ embeds: [log] })


      }

    } else if (subs == "unlock") {

      const channel = interaction.options.getChannel("channel")
      const reason = interaction.options.getString("reason") || "No reason provided"

      if (channel.type === "GUILD_VOICE") {

        var hoy = new MessageEmbed()
          .setDescription(`Unlocked the voice channel ${channel}`)
          .setColor(`${client.embedColor.moderation}`)

        interaction.followUp({ embeds: [hoy] })

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          CONNECT: null
        });

        let log = new MessageEmbed()
          .setAuthor(`Action: Channel Unlock`, interaction.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
          .setColor(`${client.embedColor.logGreen}`)
          .addField('Channel Info', `● ${channel}\n> __Name:__ ${channel.name}\n> __ID:__ ${channel.id}`, true)
          .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
          .setTimestamp()
        modlog.send({ embeds: [log] })

      } else {

        let msg = await interaction.followUp({ content: "Unlocking the channel..." })

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SEND_MESSAGES: null
        });

        var hii = new MessageEmbed()
          .setAuthor("Channel Unlocked", client.user.displayAvatarURL({ dynamic: true }))
          .setDescription("This channel has been Unlocked by a staff member.\nYou may start chatting now!")
          .setColor(`${client.embedColor.moderation}`)
          .addFields({
            name: "Reason",
            value: reason
          })
          
          .setTimestamp()

        channel.send({ embeds: [hii] })

        await msg.edit({ content: "Channel Unlocked!" })
        

        let log = new MessageEmbed()
          .setAuthor(`Action: Channel Unlock`, interaction.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
          .setColor(`${client.embedColor.logGreen}`)
          .addField('Channel Info', `● ${channel}\n> __Name:__ ${channel.name}\n> __ID:__ ${channel.id}`, true)
          .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
          .setTimestamp()
        modlog.send({ embeds: [log] })

      }
    }


  }
}