const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

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


  run: async (client, message, args, missingpartembed) => {

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
        .setAuthor("Server Unlocked", client.user.displayAvatarURL({ dynamic: null }))
        .setDescription("This server has been unlocked by a staff member.\nYou may star chatting now!")
        .setColor(`${client.embedColor.moderation}`)
        .addFields({
          name: "Reason",
          value: reason
        })
        .setTimestamp()

      let msg2 = message.guild.channels.cache.get("782837655082631229").send({ embeds: [hii] })

      await msg.edit({ content: "Unlocked the server!" })

      let log = new MessageEmbed()
        .setAuthor(`Moderation • Lockdown End`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`** **`)
        .setColor(`${client.embedColor.logs}`)
        .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${message.author}\nTag • ${message.author.tag}\nID • ${message.author.id}`, true)
        .addField("Reason", `${reason}`)
        .setTimestamp()

      const rowlog = new MessageActionRow().addComponents(

        new MessageButton()
          .setLabel("Jump to the action")
          .setStyle("LINK")
          .setURL(`https://discord.com/channels/${msg2.guild.id}/${msg2.channel.id}/${msg2.id}`)

      )

      client.webhook.moderation.send({ embeds: [log], components: [rowlog] })



    } else {

      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

      if (!channel) return message.reply({ embeds: [missingpartembed] })
      if (channel.type === "GUILD_VOICE") {

        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          CONNECT: null
        });

        let msg = await message.channel.send("Channel Unlocked!")

        let log = new MessageEmbed()
          .setAuthor(`Moderation • Channel Unlock`, message.guild.iconURL({ dynamic: true }))
          .setDescription(`** **`)
          .setColor(`${client.embedColor.logs}`)
          .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${message.author}\nTag • ${message.author.tag}\nID • ${message.author.id}`, true)
          .addField("🔊 Channel", `Mention • ${channel}\nID • ${channel.id}`, true)
          .addField("Reason", `${reason}`)
          .setTimestamp()

        const rowlog = new MessageActionRow().addComponents(

          new MessageButton()
            .setLabel("Jump to the action")
            .setStyle("LINK")
            .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

        )

        client.webhook.moderation.send({ embeds: [log], components: [rowlog] })

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
          .setAuthor(`Moderation • Channel Unlock`, message.guild.iconURL({ dynamic: true }))
          .setDescription(`** **`)
          .setColor(`${client.embedColor.logs}`)
          .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${message.author}\nTag • ${message.author.tag}\nID • ${message.author.id}`, true)
          .addField("💬 Channel", `Mention • ${channel}\nID • ${channel.id}`, true)
          .addField("Reason", `${reason}`)
          .setTimestamp()

        const rowlog = new MessageActionRow().addComponents(

          new MessageButton()
            .setLabel("Jump to the action")
            .setStyle("LINK")
            .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

        )

        client.webhook.moderation.send({ embeds: [log], components: [rowlog] })

      }

    }




  }
}