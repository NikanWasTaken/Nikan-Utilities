const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'purge',
  category: 'moderation',
  description: `Purging or clearing messages.`,
  usage: '[number of messages] <user>',
  aliases: ['clear'],
  cooldown: 10000,
  userPermissions: ["BAN_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, missingpartembed, modlog) => {

    var clear = args[0]
    var user = message.guild.members.cache.get(args[1]) || message.mentions.members.first()

    if (!clear) return message.reply({ embeds: [missingpartembed] })

    let heh = new MessageEmbed().setDescription(`${client.botEmoji.failed} You need to provide a number between 1 and 50 to purge.`).setColor(`${client.embedColor.failed}`)
    if (isNaN(clear) || clear > 50 || clear < 1) return message.reply({ embeds: [heh] })

    if (args[1]) {

      const nouser = new MessageEmbed().setDescription(`Unable to find the user: \`${args[1]}\``).setColor(`${client.embedColor.moderationRed}`)
      if(!user) return message.reply({ embeds: [nouser] })

      const messages = message.channel.messages.fetch({ limit: clear })
      const filtered = (await messages).filter(m => m.author.id === user.user.id)

      message.channel.bulkDelete(filtered)

      let embeda = new MessageEmbed()
        .setDescription(`Cleared \`${clear}\` messages from \`${user.user.tag}\``)
        .setColor(`${client.embedColor.moderation}`)

      let msglink = await message.channel.send({ embeds: [embeda] }).then((msg) => { setTimeout(() => { msg.delete(), message.delete() }, 5000) })

        let log = new MessageEmbed()
          .setAuthor(`Action: Purge`, message.guild.iconURL({ dynamic: true }))
          .setColor(`${client.embedColor.logAqua}`)
          .addField('Channel Info', `● ${msglink.channel}\n> __Name:__ ${msglink.channel.name}\n> __ID:__ ${msglink.channel.id}`, true)
          .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
          .addField("● Purge Info", `> Number of messages: **${clear}**\n> From the user: ${user.user}`)
          .setTimestamp()

        modlog.send({ embeds: [log] })


    } else if (!args[1]) {


      message.channel.bulkDelete(parseInt(clear + 1))

      let embeda = new MessageEmbed()
        .setDescription(`Cleared ${clear} messages in ${message.channel}.`)
        .setColor(`${client.embedColor.moderation}`)

      let msglink = await message.channel.send({ embeds: [embeda] }).then((msg) => { setTimeout(() => { msg.delete(), message.delete() }, 5000) })

        let log = new MessageEmbed()
          .setAuthor(`Action: Purge`, message.guild.iconURL({ dynamic: true }))
          .setColor(`${client.embedColor.logAqua}`)
          .addField('Channel Info', `● ${msglink.channel}\n> __Name:__ ${msglink.channel.name}\n> __ID:__ ${msglink.channel.id}`, true)
          .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
          .addField("● Purge Info", `> Number of messages: **${clear}**`)
          .setTimestamp()

        modlog.send({ embeds: [log] })

    }



  }
}