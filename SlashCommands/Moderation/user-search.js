const { Client, CommandInteraction, MessageEmbed } = require("discord.js");


module.exports = {
  name: "user-search",
  description: 'Searches for people in the server.',
  permissions: ["MANAGE_MESSAGES"],
  options: [
    {
      name: "user",
      description: "id, username, discriminator, nickname, tag",
      required: true,
      type: "STRING",

    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async ({ interaction }) => {

    const user = interaction.options.getString("user")
    const array = [];

    interaction.guild.members.cache.forEach((use) => {

      if (
        use.user.username.toUpperCase() == user.toUpperCase() ||
        use.user.id === user.toUpperCase() ||
        use.user.tag.toUpperCase() == user.toUpperCase() ||
        use.displayName.toUpperCase() == user.toUpperCase() ||
        use.user.discriminator == user.toUpperCase() ||
        `#${use.user.discriminator}` == user.toUpperCase() ||
        use.user.username.toUpperCase().includes(user.toUpperCase()) ||
        use.displayName.toUpperCase().includes(user.toUpperCase())
      ) {

        array.push(`● ${use.user}\n> __Tag:__ ${use.user.tag}\n> __ID:__ ${use.user.id}\n> __Nickname:__ ${use.displayName == use.user.username ? "No Nickname" : use.displayName}\n`);

      }
    });

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${interaction.guild.name} ● Searching for ${user}`,
        iconURL: interaction.guild.iconURL({ dynamic: true })
      })
      .setColor("RANDOM")
      .setDescription(array.join("\n") || "<a:red_x:872203367718457424> No Results - Can't Find Any User!")
      .setFooter({ name: array.length == 0 ? "No Result" : array.length == 1 ? `${array.length} Result` : `${array.length} Results` })
      .setTimestamp()
      .setThumbnail("https://cdn.discordapp.com/attachments/870637449158742057/874944240290005042/bloodbros-search.gif")

    interaction.followUp({ embeds: [embed] })
      .catch(() => {
        interaction.followUp("There are too many search results, can't show them all in a single interaction!")
      })
  }
}