const { MessageEmbed } = require('discord.js')
const translate = require("@iamtraction/google-translate")


module.exports = {
  name: `translate`,
  category: 'utility',
  description: `Translate your text to the custom language`,
  aliases: ['translator', 'tr'],
  cooldown: 5000,
  usage: `[to language] [text]`,
  botCommand: true,


  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, wrongUsage) => {

    let query = message.content.split(" ").slice(2).join(" ")
    let language = args[0]

    if (!language || !query) return message.reply({ embeds: [wrongUsage] })

    try {


      var translated = translate(query, { to: language })

      const translateEmbed = new MessageEmbed()
        .setTitle(`Translate`)
        .setThumbnail("https://cdn.discordapp.com/attachments/870637449158742057/870637829045239868/Translate_Icon.png")
        .setDescription(`**Language:** ${language}\n**Sentence** - ${query}\n**Translated** - ${(await translated).text}\n`)
        .setColor("#5894f4")
        .setFooter(`Requested by ${message.member.user.username}`, message.member.user.avatarURL({ dynamic: true }))
      message.reply("Translating...").then((message) => message.edit({ embeds: [translateEmbed] }))


    } catch (error) {

      let wrong = new MessageEmbed()
        .setDescription("Something went wrong while translating, this might happen when the api is not working or you did not put the correct [**language**](https://translate.google.com/intl/en/about/languages/).")
        .setColor('#b3666c')
      message.reply({ embeds: [wrong] })
    }


  }


}