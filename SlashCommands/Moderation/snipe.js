const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const moment = require("moment")


module.exports = {
  name: "snipe",
  description: 'Snipe a recently deleted messages in the channel.',
  permissions: ["MANAGE_MESSAGES"],
  options: [
    {
      name: "sniped-message-number",
      description: "The number of sniped message you want to find.",
      required: false,
      type: "INTEGER",

    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async ({ client, interaction }) => {


    const snipes = client.snipes.get(interaction.channel.id);
    if (!snipes) return interaction.followUp({
      content: "There is no recently deleted interactions in this channel!"
    })

    const optionArgs = interaction.options.getInteger("sniped-message-number");
    const snipe = +optionArgs - 1 || 0;
    const target = snipes[snipe];
    if (!target) return interaction.followUp({
      content: `There is only ${snipes.length} sniped messages!`
    })

    const { msg, time, image } = target;

    let embed = new MessageEmbed()
      .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
      .setColor("RANDOM")
      .setImage(image)
      .setDescription(msg.content)
      .setFooter({ text: `${moment(time).fromNow()} | ${snipe + 1} / ${snipes.length}` })

    interaction.followUp({ embeds: [embed] })
  }
}