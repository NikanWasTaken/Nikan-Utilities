const { Client, CommandInteraction, MessageEmbed } = require("discord.js");


module.exports = {
  name: "purge",
  description: 'Purges messages in the channel',
  cooldown: 10000,
  permissions: ["BAN_MEMBERS"],
  options: [
    {
      name: "amount",
      description: "The number of messages you want to purge.",
      required: true,
      type: "INTEGER",

    },
    {
      name: "user",
      description: "The user you want to purge the messages from!",
      required: false,
      type: "USER",

    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {

    var clear = interaction.options.getInteger("amount")
    var user = interaction.options.getMember("user")


    let heh = new MessageEmbed().setDescription(`You need to provide a number between 1 and 100 to purge.`).setColor(`RED`)

    if (isNaN(clear) || clear > 100 || clear < 1)
      return interaction.followUp({ embeds: [heh] })
        .then((msg) => {
          setTimeout(() => {
            interaction.deleteReply()
          }, 5000)
        })


    try {

      if (user) {

        const messages = interaction.channel.messages.fetch({ limit: clear })
        const filtered = (await messages).filter(m => m.author.id === user.id)

        await interaction.channel.bulkDelete(filtered)

        let embeda = new MessageEmbed()
          .setDescription(`Cleared \`${clear}\` messages from \`${user.user.tag}\``)
          .setColor(`${client.color.moderation}`)

        interaction.channel.send({ embeds: [embeda] })
          .then((msg) => {
            setTimeout(() => {
              msg.delete(), message.delete()
            }, 5000)
          })


      } else if (!user) {

        let msgs = message.channel.messages.fetch({ limit: clear })
        message.channel.bulkDelete((await msgs))

        let embeda = new MessageEmbed()
          .setDescription(`Cleared ${clear} messages in ${interaction.channel}`)
          .setColor(`${client.color.moderation}`)

        interaction.channel.send({ embeds: [embeda] })
          .then((msg) => { setTimeout(() => { msg.delete(), message.delete() }, 5000) })

      }
    } catch (error) { }
  }
}