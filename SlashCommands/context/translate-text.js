const { Client, MessageEmbed } = require("discord.js");
const translate = require("@iamtraction/google-translate")

module.exports = {
  name: "Translate Message",
  type: 'MESSAGE',

  /**
   *
   * @param {Client} client
   * @param {ContextMenuInteraction} interaction
   * @param {String[]} args
   */
  run: async ({ interaction }) => {
    const msg = await interaction.channel.messages.fetch(
      interaction.targetId
    );

    if (!msg.content) return interaction.followUp("Make sure that the message contains a content.")

    const translated = await translate(msg.content, { to: 'en' });
    const embed = new MessageEmbed()
      .setTitle("Translate")
      .setThumbnail("https://cdn.discordapp.com/attachments/870637449158742057/870637829045239868/Translate_Icon.png")
      .setDescription(`[**↗️ Jump to the message**](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
      .addField(`Sentence`, msg.content, true)
      .addField("Translated", translated.text, true)
      .setColor("#5894f4")
      .setFooter({
        name: `${interaction.member.user.username} reqested to translate ${msg.member.user.username}'s message!`,
        iconURL: interaction.member.user.avatarURL({ dynamic: true })
      })

    interaction.followUp({ embeds: [embed] })
  },
};