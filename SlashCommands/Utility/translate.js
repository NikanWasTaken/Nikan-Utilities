const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const translate = require("@iamtraction/google-translate")



module.exports = {
  name: "translate",
  description: `Translate your text to the custom language`,
  botCommand: true,
  cooldown: 5000,
  options: [
    {
      name: "language",
      description: "The language you want your text to be translated to!",
      required: true,
      type: "STRING",

    },
    {
      name: "text",
      description: "The text you want it to get translated!",
      required: true,
      type: "STRING",

    }
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async ({ interaction }) => {


    try {

      let query = interaction.options.getString("text")
      let language = interaction.options.getString("language")

      var translated = translate(query, { to: language })

      const translateEmbed = new MessageEmbed()
        .setTitle(`Translate`)
        .setThumbnail("https://cdn.discordapp.com/attachments/870637449158742057/870637829045239868/Translate_Icon.png")
        .setDescription(`**Language:** ${language}\n**Sentence** - ${query}\n**Translated** - ${(await translated).text}\n`)
        .setColor("#5894f4")
        .setFooter(`Requested by ${interaction.member.user.username}`, interaction.member.user.avatarURL({ dynamic: true }))
      interaction.followUp({ embeds: [translateEmbed] })


    } catch (error) {

      let wrong = new MessageEmbed()
        .setDescription("Something went wrong while translating, this might happen when the api is not working or you did not put the correct [**language**](https://translate.google.com/intl/en/about/languages/).")
        .setColor('#b3666c')
      interaction.followUp({ embeds: [wrong] })
    }

  }
}