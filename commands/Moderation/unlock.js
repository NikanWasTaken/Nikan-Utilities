const { MessageEmbed, Client, Message } = require('discord.js')

module.exports = {
  name: 'unlock',
  category: 'moderation',
  description: `Unlocks the channel`,
  usage: "[#channel/all] <reason>",
  cooldown: 3000,
  permissions: ["BAN_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */


  run: async (client, message, args, wrongUsage) => {

    const reason = args.slice(1).join(" ") || "No reason provided"

    if (args[0].toLowerCase() == "all") {


      let msg = await message.reply({ content: "Unlocking the server..." })

      message.guild.channels.cache.filter(ch => ch.type === "GUILD_TEXT").forEach(ch => {
        ch.permissionOverwrites.edit(message.guild.roles.everyone, {
          SEND_MESSAGES: null
        })
      })
      message.guild.channels.cache.filter(ch => ch.type === "GUILD_VOICE").forEach(ch => {
        ch.permissionOverwrites.edit(message.guild.roles.everyone, {
          CONNECT: null
        })
      })

      var serverUnlockedEmbed = new MessageEmbed()
        .setAuthor({ name: "Server Unlocked", iconURL: client.user.displayAvatarURL() })
        .setDescription("This server has been unlocked by a staff member.")
        .setColor(`${client.color.moderation}`)
        .addFields({
          name: "Reason",
          value: reason
        })
        .setTimestamp()

      message.guild.channels.cache.get(`${client.server.generalChat}`)
        .send({ embeds: [serverUnlockedEmbed] })

      await msg.edit({ content: "Unlocked the server!" })


    } else {

      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
      if (!channel) return wrongUsage(message)

      if (channel.type === "GUILD_VOICE" || channel.type === "GUILD_STAGE_VOICE") {

        let msg = await message.reply("Unlocking the voice channel...")

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          CONNECT: null
        });

        await msg.edit({
          content: `Unlocked ${channel}`
        })


      } else if (channel.type === "GUILD_TEXT") {

        let msg = await message.reply({ content: "Unlocking the channel..." })

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          SEND_MESSAGES: null
        });

        var channelUnlocked = new MessageEmbed()
          .setAuthor({ name: "Channel Unlocked", iconURL: client.user.displayAvatarURL() })
          .setDescription("This channel has been Unlocked by a staff member.")
          .setColor(`${client.color.moderation}`)
          .addFields({
            name: "Reason",
            value: reason
          })
          .setTimestamp()

        await channel.send({ embeds: [channelUnlocked] })

        await msg.edit({ content: "Unlocked the channel!" })

      } else {
        const embed = new MessageEmbed()
          .setDescription(`Sorry, but you can only unlock text, voice and stage channels. [${channel}]`)
          .setColor("RED")

        message.reply({ embeds: [embed] })
          .then(msg => {
            client.delete.message(message, msg)
          })
      }
    }
  }
}