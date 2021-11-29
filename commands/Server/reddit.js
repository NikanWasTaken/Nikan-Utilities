const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    name : 'reddit',
    category : 'server',
    description : "Shows a link to Nikan's World's reddit!",
    cooldown: 120000,
    aliases: ["subreddit", "sub-reddit"],
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        const server = client.guilds.cache.get(client.server.id)

        const embed = new MessageEmbed()
         .setAuthor(`${server.name} Subreddit`, "https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png")
         .setDescription(`If you didn't already now, [${server.name}](${client.server.invite}) actually has a [Reddit page](https://www.reddit.com/r/NikanWorld/).\nYou can post memes, funny things happened on discord and other things there!\nAfter posting something on there, your post will get posted in [this channel](https://discord.com/channels/${client.server.id}/868358834052296724).`)
         .setColor("PURPLE")

         const row = new MessageActionRow().addComponents(
             new MessageButton()
              .setLabel("Subreddit Page")
              .setStyle("LINK")
              .setEmoji("")
              .setURL("https://www.reddit.com/r/NikanWorld/")
         )

         message.channel.send({ embeds: [embed], components: [row] })

    }}