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

    const reason = args.slice(1).join(" ")
    if (!args[0]) return wrongUsage(message)


    if (args[0].toLowerCase() == "all" || args[0].toLowerCase() == "lockdown") {

      if (!reason) return wrongUsage(message)

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
      message.guild.channels.cache.get(`${client.server.verificationChannel}`)
        .permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: null })

      const serverLockedEmbed = new MessageEmbed()
        .setAuthor({ name: "Server Locked", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setDescription("This server is currently on lockdown, please don't dm any staff members about this. more information will be sent here.\n__**You are not muted**__")
        .setColor(`${client.color.moderation}`)
        .setTimestamp()
        .addFields({
          name: "Reason",
          value: reason
        })

      await message.guild.channels.cache.get(`${client.server.generalChannel}`)
        .send({
          embeds: [serverLockedEmbed]
        })
      await msg.edit({ content: "Server Locked!" })

    } else {

      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
      if (!channel) return message.reply({
        embeds: [{
          description: "I couldn't find that channel.",
          color: "RED"
        }]
      })
        .then(msg => { client.delete.message(message, msg) })

      if (channel.type === "GUILD_VOICE" || channel.type === "GUILD_STAGE_VOICE") {

        let msg = await message.reply({ content: "Locking the voice channel..." })
        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          CONNECT: false
        });

        await msg.edit({ content: `Locked ${channel}` })

      } else if (channel.type === "GUILD_TEXT") {

        if (!args[0] || !reason) return wrongUsage(message)

        let msg = await message.reply({ content: "Locking the channel..." })

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          SEND_MESSAGES: false
        });

        var channelLockedEmbed = new MessageEmbed()
          .setAuthor({ name: "Channel Locked", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setDescription("This channel was locked by a staff member.\nPlease don't dm any staff members about this, __you are not muted__.\n")
          .setColor(`${client.color.moderation}`)
          .setTimestamp()
          .addFields({
            name: "Reason",
            value: reason
          })

        await channel.send({ embeds: [channelLockedEmbed] })

        await msg.edit({ content: "Channel Locked!" })

      } else {
        const embed = new MessageEmbed()
          .setDescription(`Sorry, but you can only lock text, voice and stage channels. [${channel}]`)
          .setColor("RED")

        message.reply({ embeds: [embed] })
          .then(msg => {
            client.delete.message(message, msg)
          })
      }
    }
  }
}