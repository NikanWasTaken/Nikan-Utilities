const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')

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
        .setDescription("__**You're not muted!**__\nThe server has been locked by a staff memeber, more information will be sent here!")
        .setColor(`${client.embedColor.moderation}`)
        .setTimestamp()
        .addFields({
          name: "Reason",
          value: reason
        })

      message.guild.channels.cache.get("782837655082631229").send({ embeds: [hii] })

      let log = new MessageEmbed()
        .setAuthor(`Moderation • Lockdown`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`** **`)
        .setColor(`${client.embedColor.logs}`)
        .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${message.author}\nTag • ${message.author.tag}\nID • ${message.author.id}`, true)
        .addField("Reason", `${reason}`)
        .setTimestamp()

      const rowlog = new MessageActionRow().addComponents(

        new MessageButton()
          .setLabel("Jump to the action")
          .setStyle("LINK")
          .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

      )

      modlog.send({ embeds: [log], components: [rowlog] })



    } else {

      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

      if (channel.type === "GUILD_VOICE") {

        let msg = await message.reply({ content: "Channel Locked!" })

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          CONNECT: false
        });

        let log = new MessageEmbed()
          .setAuthor(`Moderation • Channel Lock`, message.guild.iconURL({ dynamic: true }))
          .setDescription(`** **`)
          .setColor(`${client.embedColor.logs}`)
          .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${message.author}\nTag • ${message.author.tag}\nID • ${message.author.id}`, true)
          .addField("🔇 Channel", `Mention • ${channel}\nID • ${channel.id}`, true)
          .addField("Reason", `${reason}`)
          .setTimestamp()

        const rowlog = new MessageActionRow().addComponents(

          new MessageButton()
            .setLabel("Jump to the action")
            .setStyle("LINK")
            .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

        )

        modlog.send({ embeds: [log], components: [rowlog] })

      } else {

        if (!args[0] || !reason) return message.reply({ embeds: [missingpartembed] })

        let msg = await message.reply({ content: "Locking the channel..." })

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          SEND_MESSAGES: false
        });

        await msg.edit({ content: "Channel Locked! " })

        var hii = new MessageEmbed()
          .setAuthor("Channel Locked", client.user.displayAvatarURL({ dynamic: true }))
          .setDescription("This channel has been locked by a staff member. You are not muted.\nMore information will be sent here eventually.")
          .setColor(`${client.embedColor.moderation}`)
          .setTimestamp()
          .addFields({
            name: "Reason",
            value: reason
          })

        let msg2 = channel.send({ embeds: [hii] })

        let log = new MessageEmbed()
          .setAuthor(`Moderation • Channel Lock`, message.guild.iconURL({ dynamic: true }))
          .setDescription(`** **`)
          .setColor(`${client.embedColor.logs}`)
          .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${message.author}\nTag • ${message.author.tag}\nID • ${message.author.id}`, true)
          .addField("🔕 Channel", `Mention • ${channel}\nID • ${channel.id}`, true)
          .addField("Reason", `${reason}`)
          .setTimestamp()

        const rowlog = new MessageActionRow().addComponents(

          new MessageButton()
            .setLabel("Jump to the action")
            .setStyle("LINK")
            .setURL(`https://discord.com/channels/${msg2.guild.id}/${msg2.channel.id}/${msg2.id}`)

        )

        modlog.send({ embeds: [log], components: [rowlog] })

      }

    }


  }
}