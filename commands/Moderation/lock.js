const { MessageEmbed, Message, Client } = require('discord.js')

module.exports = {
  name: 'lock',
  category: 'moderation',
  description: `Locks the chnanel`,
  usage: '[channel/all] [reason]',
  cooldown: 3000,
  permissions: ["BAN_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, wrongUsage) => {

    var reason = args.slice(1).join(" ")

    if (!args[0]) return message.reply({ embeds: [wrongUsage] })

    if (args[0].toLowerCase() == "all") {

      if (!reason) return message.reply({ embeds: [wrongUsage] })

      let msg = await message.reply({ content: "Locking the server..." })

      message.guild.channels.cache.filter(ch => ch.type === "GUILD_TEXT").forEach(ch => {
        ch.permissionOverwrites.edit(message.guild.roles.everyone, {
          SEND_MESSAGES: false
        })
      })

      message.guild.channels.cache.filter(ch => ch.type === "GUILD_VOICE").forEach(ch => {
        ch.permissionOverwrites.edit(message.guild.roles.everyone, {
          CONNECT: false
        })
      })

      await msg.edit({ content: "Server Locked!" })

      var hii = new MessageEmbed()
        .setAuthor("Server Locked", client.user.displayAvatarURL({ dynamic: true }))
        .setDescription("__**You're not muted!**__\nThe server has been locked by a staff memeber, more information will be sent here!")
        .setColor(`${client.color.moderation}`)
        .setTimestamp()
        .addFields({
          name: "Reason",
          value: reason
        })

      await message.guild.channels.cache.get("782837655082631229").send({ embeds: [hii] })


    } else {

      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

      if (channel.type === "GUILD_VOICE") {

        let msg = await message.reply({ content: "Channel Locked!" })

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          CONNECT: false
        });

      } else {

        if (!args[0] || !reason) return message.reply({ embeds: [wrongUsage] })

        let msg = await message.reply({ content: "Locking the channel..." })

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          SEND_MESSAGES: false
        });

        await msg.edit({ content: "Channel Locked!" })

        var hii = new MessageEmbed()
          .setAuthor("Channel Locked", client.user.displayAvatarURL({ dynamic: true }))
          .setDescription("This channel has been locked by a staff member. You are not muted.\nMore information will be sent here eventually.")
          .setColor(`${client.color.moderation}`)
          .setTimestamp()
          .addFields({
            name: "Reason",
            value: reason
          })

        await channel.send({ embeds: [hii] })


      }

    }


  }
}