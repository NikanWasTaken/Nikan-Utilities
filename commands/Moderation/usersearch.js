const { MessageEmbed, Message, Client, MessageActionRow, MessageButton } = require("discord.js");
const totalResultsInPage = 3
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
    if (!user) return wrongUsage(message);
    let i0 = 0;
    let i1 = totalResultsInPage;
    let page = 1;

    const findUsers = message.guild.members.cache.filter(use =>
      use.user.username.toUpperCase() == user.toUpperCase() ||
      use.user.id === user.toUpperCase() ||
      use.user.tag.toUpperCase() == user.toUpperCase() ||
      use.displayName.toUpperCase() == user.toUpperCase() ||
      use.user.discriminator == user.toUpperCase() ||
      `#${use.user.discriminator}` == user.toUpperCase() ||
      use.user.username.toUpperCase().includes(user.toUpperCase()) ||
      use.displayName.toUpperCase().includes(user.toUpperCase())
    )

    let mapped;
    mapped = findUsers
      .map((user) => {
        return [
          `➜ ${user}`,
          `• **ID:** ${user.user.id}`,
          `• **Tag:** ${user.user.tag}`,
          `• **Nickname:** ${user.displayName == user.user.username ? "No Nickname" : user.displayName}`,
        ].join("\n")
      })
      .slice(0, totalResultsInPage)
      .join("\n\n");


    const components = (options) => [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setStyle("PRIMARY")
          .setDisabled(options.disable1 || false)
          .setEmoji("⬅️")
          .setCustomId("lastpage"),
        new MessageButton()
          .setStyle("PRIMARY")
          .setDisabled(options.disable2 || false)
          .setEmoji("➡️")
          .setCustomId("nextpage")
      )
    ];

    if (findUsers.size <= 0) return message.reply("No result were found!")

    const embed = new MessageEmbed()
      .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setTitle(`Searching for ${user}`)
      .setDescription(mapped)
      .setThumbnail("https://cdn.discordapp.com/attachments/870637449158742057/874944240290005042/bloodbros-search.gif")
      .setColor(`${client.color.serverPurple}`)
      .setFooter({ text: `Page ${page}/${Math.ceil(findUsers.size / totalResultsInPage)}` })
      .setTimestamp()

    if (findUsers.size < totalResultsInPage) return message.reply({ embeds: [embed], components: [] })

    let msg = await message.reply({ embeds: [embed], components: components({ disable1: true, disable2: false }) })

    const collector = msg.createMessageComponentCollector({
      time: 30000,
      componentType: "BUTTON"
    })

    collector.on("collect", (collected) => {

      if (message.author.id !== collected.user.id)
        return collected.reply({ content: "This menu isn't for you!", ephemeral: true })

      switch (collected.customId) {
        case "lastpage":
          collected.deferUpdate()
          i0 = i0 - totalResultsInPage;
          i1 = i1 - totalResultsInPage;
          page = page - 1;

          if (page <= 0) return msg.edit({ components: components({ disable1: true }) });
          if (page >= Math.ceil(findUsers.size / totalResultsInPage) + 1) return msg.edit({ components: components({ disable2: true }) });

          mapped = findUsers
            .map((user) => {
              return [
                `➜ ${user}`,
                `• **ID:** ${user.user.id}`,
                `• **Tag:** ${user.user.tag}`,
                `• **Nickname:** ${user.displayName == user.user.username ? "No Nickname" : user.displayName}`,
              ].join("\n")
            })
            .slice(i0, i1)
            .join("\n\n");

          embed
            .setDescription(mapped)
            .setFooter({ text: `Page ${page}/${Math.ceil(findUsers.size / totalResultsInPage)}` })

          msg.edit({ embeds: [embed], components: components({ disable1: false, disable2: false }) })
          break;

        case "nextpage":
          collected.deferUpdate()
          i0 = i0 + totalResultsInPage;
          i1 = i1 + totalResultsInPage;
          page = page + 1;

          if (page <= 0) return msg.edit({ components: components({ disable1: true }) });
          if (page >= Math.ceil(findUsers.size / totalResultsInPage) + 1) return msg.edit({ components: components({ disable2: true }) });

          mapped = findUsers
            .map((user) => {
              return [
                `➜ ${user}`,
                `• **ID:** ${user.user.id}`,
                `• **Tag:** ${user.user.tag}`,
                `• **Nickname:** ${user.displayName == user.user.username ? "No Nickname" : user.displayName}`,
              ].join("\n")
            })
            .slice(i0, i1)
            .join("\n\n");

          embed
            .setDescription(mapped)
            .setFooter({ text: `Page ${page}/${Math.ceil(findUsers.size / totalResultsInPage)}` })

          msg.edit({ embeds: [embed], components: components({ disable1: false, disable2: false }) })
          break;
      }
    })

    collector.on("end", () => { msg.edit({ components: [] }) })

  }
}
