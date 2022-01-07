const { MessageEmbed, Message, Client } = require('discord.js')

module.exports = {
  name: 'purge',
  category: 'moderation',
  description: `Purging or clearing messages.`,
  usage: '[number of messages] <user>',
  aliases: ['clear'],
  cooldown: 10000,
  permissions: ["BAN_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async ({ client, message, args, wrongUsage }) => {

    var clear = args[0]
    var user = message.guild.members.cache.get(args[1]) || message.mentions.members.first()
    if (!clear) return message.reply({ embeds: [wrongUsage] })

    let heh = new MessageEmbed()
      .setDescription(`You need to provide a number between 1 and 100 to purge.`)
      .setColor(`RED`)
    if (isNaN(clear) || clear > 100 || clear < 1) return message.reply({ embeds: [heh] }).then((msg) => {
      client.delete.message(message, msg);
    })

    try {


      if (args[1]) {

        const noUser = new MessageEmbed()
          .setDescription(`I couldn't find that user!`)
          .setColor("RED")
        if (!user) return message.reply({ embeds: [noUser] }).then((msg) => {
          client.delete.message(message, msg);
        })

        const messages = message.channel.messages.fetch({ limit: clear })
        const filtered = (await messages).filter(m => m.author.id === user.user.id)

        message.channel.bulkDelete(filtered)
        let embeda = new MessageEmbed()
          .setDescription(`Cleared \`${clear}\` messages from \`${user.user.tag}\``)
          .setColor(`${client.color.moderation}`)
        message.channel.send({ embeds: [embeda] })
          .then((msg) => {
            client.delete.message(message, msg);
          })


      } else if (!args[1]) {

        let msgs = message.channel.messages.fetch({ limit: clear })

        message.channel.bulkDelete((await msgs))
        let embeda = new MessageEmbed()
          .setDescription(`Cleared ${clear} messages in ${message.channel}.`)
          .setColor(`${client.color.moderation}`)

        message.channel.send({ embeds: [embeda] })
          .then((msg) => {
            client.delete.message(message, msg);
          })
      }
    } catch (error) { }
  }
}