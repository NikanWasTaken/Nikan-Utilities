const { MessageEmbed, Message, Client } = require("discord.js");

module.exports = {
  name: "usersearch",
  description: "Search for people in the server",
  category: "Moderation",
  aliases: ["usearch"],
  usage: `[user's ID, username, discriminator, nickname, tag]`,
  cooldown: 5000,
  permissions: ["MANAGE_MESSAGES"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, wrongUsage) => {

    const user = args.join(" ")
    if (!user) return message.reply({ embeds: [wrongUsage] });
    const array = [];

    message.guild.members.cache.forEach((use) => {

      if (use.user.username.toUpperCase() == user.toUpperCase() ||
        use.user.id === user.toUpperCase() ||
        use.user.tag.toUpperCase() == user.toUpperCase() ||
        use.displayName.toUpperCase() == user.toUpperCase() ||
        use.user.discriminator == user.toUpperCase() ||
        `#${use.user.discriminator}` == user.toUpperCase() ||
        use.user.username.toUpperCase().includes(user.toUpperCase()) ||
        use.displayName.toUpperCase().includes(user.toUpperCase())) {

        array.push(`● ${use.user}\n> __Tag:__ ${use.user.tag}\n> __ID:__ ${use.user.id}\n> __Nickname:__ ${use.displayName == use.user.username ? "No Nickname" : use.displayName}\n`);

      }
    });

    const embed = new MessageEmbed()
      .setAuthor(`${message.guild.name} ● Searching for ${user}`, message.guild.iconURL({ dynamic: true }))
      .setColor("RANDOM")
      .setDescription(array.join("\n") || "<a:red_x:872203367718457424> No Results - Can't Find Any User!")
      .setFooter(array.length == 0 ? "No Result" : array.length == 1 ? `${array.length} Result` : `${array.length} Results`)
      .setTimestamp()
      .setThumbnail("https://cdn.discordapp.com/attachments/870637449158742057/874944240290005042/bloodbros-search.gif")

    message.reply({ embeds: [embed] })
      .catch(e => {
        message.reply({
          content: "There are too many search results, can't show them all in a single message!"
        })
      })


  },
};
