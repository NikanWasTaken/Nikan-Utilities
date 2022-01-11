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

    var reason = args.slice(1).join(" ") || "No reason provided"

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

      var hii = new MessageEmbed()
        .setAuthor({ name: "Server Unlocked", iconURL: client.user.displayAvatarURL({ dynamic: null }) })
        .setDescription("This server has been unlocked by a staff member.\nYou may star chatting now!")
        .setColor(`${client.color.moderation}`)
        .addFields({
          name: "Reason",
          value: reason
        })
        .setTimestamp()

      message.guild.channels.cache.get("782837655082631229").send({ embeds: [hii] })

      await msg.edit({ content: "Unlocked the server!" })


    } else {

      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

      if (!channel) return message.reply({ embeds: [wrongUsage] })
      if (channel.type === "GUILD_VOICE") {

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          CONNECT: null
        });

        await message.channel.send("Channel Unlocked!")


      } else {


        let msg = await message.reply({ content: "Unlocking the channel..." })

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          SEND_MESSAGES: null
        });

        var hii = new MessageEmbed()
          .setAuthor({ name: "Channel Unlocked", iconURL: client.user.displayAvatarURL({ dynamic: null }) })
          .setDescription("This channel has been Unlocked by a staff member.\nYou may start chatting now!")
          .setColor(`${client.color.moderation}`)
          .addFields({
            name: "Reason",
            value: reason
          })
          .setTimestamp()

        channel.send({ embeds: [hii] })

        await msg.edit({ content: "Unlocked the channel!" })

      }
    }
  }
}