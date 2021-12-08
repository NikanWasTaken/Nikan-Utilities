const { MessageEmbed, WebhookClient, MessageAttachment, Message } = require('discord.js')

module.exports = {
  name: 'boo',
  category: 'Secret',
  description: 'Boop!',
  usage: `<boo this guy>`,
  aliases: ["boop"],
  cooldown: 2000,
  userPermissions: ["MANAGE_MESSAGES"],
  visible: false,


  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {

    const array = [
      "https://i2.wp.com/www.swiss-miss.com/wp-content/uploads/2015/10/tattly_mike_lowery_boo_who_web_design_01_grande-480x480.jpg?ssl=1",
      "https://www.ffbchamber.com/wp-content/uploads/2021/01/halloween-boo.jpg",
      "https://cdn.shopify.com/s/files/1/2725/8862/products/De_Vier_Windstreken-Belle-_-Boo-Bedtijd-voor-Boo-Mandy-Sutcliffe-Boek-Prentenboek-Book-Elenfhant-600PX_530x@2x.jpg?v=1577987768",
      "https://cdn.shopify.com/s/files/1/0301/0501/products/ghost-says-boo-Thumbnail-Mockup.jpg?v=1613242192",
      "https://thumbs.dreamstime.com/b/ghost-cute-halloween-ghost-speech-bubble-boo-vector-ghost-cute-halloween-ghost-speech-bubble-boo-vector-illustration-121874369.jpg",
      "https://cdn.discordapp.com/attachments/793422320936288276/914197403391901786/Screen_Shot_1400-09-06_at_20.10.08.png"
    ]

    const boop = array[~~(Math.random() * array.length)]
    const boo = new MessageAttachment(boop)

    let msg = await message.channel.send({ files: [boo] })

    const collector = message.channel.createMessageCollector({
      filter: (m) =>
        m.content.toLowerCase().includes("boo") && !m.author.bot,
      time: 60000,
      max: 1
    });

    const emojis = [
      "👻",
      "😰",
      "😬",
      "❤️‍🩹",
      "<a:dogboop:914197356663148546>"
    ]

    const randomemoji = emojis[~~(Math.random() * emojis.length)];

    collector.on("collect", async (i) => {


      i.react(randomemoji)

    })

  }
}