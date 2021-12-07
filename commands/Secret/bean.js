const { MessageEmbed, WebhookClient } = require('discord.js')
const random = require("randomstring")

module.exports = {
  name: 'bean',
  category: 'Secret',
  description: 'Fake ban a person',
  usage: `[user] <reason>`,
  cooldown: 2000,
  userPermissions: ["MANAGE_MESSAGES"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {

    const user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()

    if (!user) return message.reply({ content: "who?" })

    const fakeId = random.generate(24);

    const embed = new MessageEmbed()
      .setDescription(`${user.user} has been **beaned** | \`${fakeId}\``)
      .setColor(`${client.color.moderationRed}`)

    let msg = await message.channel.send({ embeds: [embed] })

    const collector = message.channel.createMessageCollector({
      filter: (m) =>
        m.content.toLowerCase().includes("bean") && !m.author.bot,
      time: 60000,
      max: 1
    });

    const emojis = [
      "🍀",
      "☘️",
      "🍃",
      "🌿",
      "🌱"
    ]

    const randomemoji = emojis[~~(Math.random() * emojis.length)];

    collector.on("collect", async (i) => {


      i.react(randomemoji)

    })



  }
}