const { MessageEmbed, WebhookClient } = require('discord.js')
const random = require("randomstring")

module.exports = {
  name: 'warm',
  category: 'Secret',
  description: 'Fake warn a user!',
  usage: `[user] <reason>`,
  cooldown: 2000,
  permissions: ["MANAGE_MESSAGES"],
  visible: false,

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
      .setDescription(`${user.user} has been **warmed** | \`${fakeId}\``)
      .setColor(`${client.color.moderation}`)

    let msg = await message.channel.send({ embeds: [embed] })

    const collector = message.channel.createMessageCollector({
      filter: (m) =>
        m.content.toLowerCase().includes("warm") && !m.author.bot,
      time: 60000,
      max: 1
    });

    const emojis = [
      "🔥",
      "❤️‍🔥",
      "🌤",
      "🥰"
    ]

    const randomemoji = emojis[~~(Math.random() * emojis.length)];

    collector.on("collect", async (i) => {


      i.react(randomemoji)

    })



  }
}