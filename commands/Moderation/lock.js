const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'lock',
  category: 'moderation',
  description: `Locks the chnanel`,
  usage: '[channel/all] [reason]',
  cooldown: 3000,
  userPermissions: ["BAN_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, missingpartembed, modlog) => {

    var reason = args.slice(1).join(" ")


    if (!args[0]) return message.reply({ embeds: [missingpartembed] })

    if (args[0].toLowerCase() == "all") {

      if (!reason) return message.reply({ embeds: [missingpartembed] })

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
        .setDescription("This server has been locked by a staff member. You are not muted.\nMore information will be sent here eventually.")
        .setColor(`${client.embedColor.moderation}`)
        .setTimestamp()
        .addFields({
          name: "Reason",
          value: reason
        })

      message.guild.channels.cache.get("782837655082631229").send({ embeds: [hii] })

      let log = new MessageEmbed()
        .setAuthor(`Action: Server Lock`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Channel Info', `● ${message.guild.name}\n> All the channnels\n> Lockdown`, true)
        .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
        .addField("● Lockdown Info", `> Reason: ${reason}`)
        .setTimestamp()
      modlog.send({ embeds: [log] })



    } else {

      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

      if (channel.type === "GUILD_VOICE") {

        var hoy = new MessageEmbed()
          .setDescription(`${client.botEmoji.success} Locked the voice channel ${channel} for the reason: ${reason}`)
          .setColor(`${client.embedColor.success}`)

        message.reply({ embeds: [hoy] })

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          CONNECT: false
        });

        let log = new MessageEmbed()
          .setAuthor(`Action: Channel Lock`, message.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
          .setColor(`${client.embedColor.logYellow}`)
          .addField('Channel Info', `● ${channel}\n> __Name:__ ${channel.name}\n> __ID:__ ${channel.id}`, true)
          .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
          .addField("● Lock Info", `> Reason: ${reason}`)
          .setTimestamp()
        modlog.send({ embeds: [log] })

      } else {

        if (!args[0] || !reason) return message.reply({ embeds: [missingpartembed] })

        let msg = await message.reply({ content: "Locking the channel..." })

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          SEND_MESSAGES: false
        });

        await msg.edit({ content: "Channel Locked! "})

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


        let log = new MessageEmbed()
          .setAuthor(`Action: Channel Lock`, message.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
          .setColor(`${client.embedColor.logYellow}`)
          .addField('Channel Info', `● ${channel}\n> __Name:__ ${channel.name}\n> __ID:__ ${channel.id}`, true)
          .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
          .addField("● Lock Info", `> Reason: ${reason}`)
          .setTimestamp()
        modlog.send({ embeds: [log] })

      }

    }


  }
}