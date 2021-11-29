const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'unlock',
  category: 'moderation',
  description: `Unlocks the channel`,
  usage: "[#channel/all] <reason>",
  cooldown: 3000,
  userPermissions: ["BAN_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */


  run: async (client, message, args, missingpartembed, modlog) => {

    var reason = args.slice(1).join(" ") || "No reason provided"

    if (!args[0]) return message.reply({ embeds: [missingpartembed] })

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
        .setAuthor("Server Unlocked", client.user.displayAvatarURL({ dynamic: null }))
        .setDescription("This server has been unlocked by a staff member.\nYou may star chatting now!")
        .setColor(`${client.embedColor.moderation}`)
        .addFields({
          name: "Reason",
          value: reason
        })
        .setTimestamp()

      message.guild.channels.cache.get("782837655082631229").send({ embeds: [hii] })

      await msg.edit({ content: "Unlocked the server!" })

      let log = new MessageEmbed()
        .setAuthor(`Action: Server Unlock`, message.guild.iconURL({ dynamic: null }))
        .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Channel Info', `● ${message.guild.name}\n> All the channnels\n> Lockdown ended`, null)
        .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, null)
        .setTimestamp()
      modlog.send({ embeds: [log] })



    } else {

      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

      if (!channel) return message.reply({ embeds: [missingpartembed] })
      if (channel.type === "GUILD_VOICE") {

        var hoy = new MessageEmbed()
          .setDescription(`Unlocked the voice channel ${channel}`)
          .setColor(`${client.embedColor.moderation}`)

        message.reply({ embeds: [hoy] })

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          CONNECT: null
        });

        let log = new MessageEmbed()
          .setAuthor(`Action: Channel Unlock`, message.guild.iconURL({ dynamic: null }))
          .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
          .setColor(`${client.embedColor.logGreen}`)
          .addField('Channel Info', `● ${channel}\n> __Name:__ ${channel.name}\n> __ID:__ ${channel.id}`, null)
          .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, null)
          .setTimestamp()
        modlog.send({ embeds: [log] })

      } else {


        let msg = await message.reply({ content: "Unlocking the channel..." })

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          SEND_MESSAGES: null
        });

        var hii = new MessageEmbed()
          .setAuthor("Channel Unlocked", client.user.displayAvatarURL({ dynamic: null }))
          .setDescription("This channel has been Unlocked by a staff member.\nYou may start chatting now!")
          .setColor(`${client.embedColor.moderation}`)
          .addFields({
            name: "Reason",
            value: reason
          })
          .setTimestamp()

        channel.send({ embeds: [hii] })

        await msg.edit({ content: "Unlocked the channel!" })


        let log = new MessageEmbed()
          .setAuthor(`Action: Channel Unlock`, message.guild.iconURL({ dynamic: null }))
          .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
          .setColor(`${client.embedColor.logGreen}`)
          .addField('Channel Info', `● ${channel}\n> __Name:__ ${channel.name}\n> __ID:__ ${channel.id}`, null)
          .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, null)
          .setTimestamp()
        modlog.send({ embeds: [log] })

      }

    }




  }
}