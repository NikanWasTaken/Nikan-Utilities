const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    name : 'vote',
    category : 'server',
    description : "Shows a link to Nikan's World vote page on top.gg!",
    cooldown: 120000,
    aliases: ["top.gg", "topgg", "top-gg"],
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        const server = client.guilds.cache.get(client.server.id)

        const embed = new MessageEmbed()
         .setAuthor(`Vote for ${server.name}`, "https://avatars.githubusercontent.com/u/34552786?s=280&v=4")
         .setDescription(`You can vote for [${server.name}](${client.server.invite}) on [top.gg](https://top.gg/servers/757268973674037315).\nBy Voting you recive a special role called ${server.roles.cache.get("843428554150772736")}.\nThis role will get expired in **12 hours** after you [vote](https://top.gg/servers/757268973674037315/vote).\nIt has some epic perks such as advertising in the [self advertising channel](https://discord.com/channels/${client.server.id}/807265233096933406).`)
         .setColor("PURPLE")

         const row = new MessageActionRow().addComponents(
             new MessageButton()
              .setLabel("Vote Now")
              .setStyle("LINK")
              .setURL("https://top.gg/servers/757268973674037315/vote")
         )

         message.channel.send({ embeds: [embed], components: [row] })

    }}