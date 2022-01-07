const { MessageEmbed, MessageActionRow, MessageButton, Client, Message } = require('discord.js')

module.exports = {
    name: 'vote',
    category: 'server',
    description: "Shows a link to Nikan's World vote page on top.gg!",
    cooldown: 120000,
    aliases: ["top.gg", "topgg", "top-gg"],


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async ({ client, message }) => {

        const server = client.guilds.cache.get(client.server.id)

        const embed = new MessageEmbed()
            .setAuthor({ name: `Vote for ${server.name}`, iconURL: "https://avatars.githubusercontent.com/u/34552786?s=280&v=4" })
            .setDescription(
                [
                    `You can vote for [${server.name}](${client.server.invite}) on [top.gg](https://top.gg/servers/${client.server.id}).`,
                    `By Voting you recive a special role called ${server.roles.cache.get("843428554150772736")}.`,
                    `This role will get expired in **12 hours** after you [vote](https://top.gg/servers/${client.server.id}/vote).`,
                    `It has some epic perks such as advertising in the [self advertising channel](https://discord.com/channels/${client.server.id}/807265233096933406).`
                ].join("\n")
            )
            .setColor(`${client.color.serverPurple}`)

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Vote Now")
                .setStyle("LINK")
                .setURL(`https://top.gg/servers/${client.server.id}/vote`)
        )

        message.channel.send({ embeds: [embed], components: [row] })

    }
}