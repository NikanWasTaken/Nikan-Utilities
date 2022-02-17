const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');

module.exports = {
    name: 'nitro',
    category: 'Secret',
    description: 'Gives people free nitro!',
    usage: '',
    permissions: [],
    cooldown: 120000,
    developer: false,
    visible: false,

    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message) => {

        function expireIn() {
            var hour = 1 + Math.random() * (48 - 1) | 0;
            return hour == 1 ? `${hour} hour` : `${hour} hours`;
        }

        const nitroEmbed = new MessageEmbed()
            .setTitle("You've been gifted a subscription!")
            .setDescription(
                [
                    `**${client.users.cache.random()?.tag}** has gifted you Nitro for **1 month**!`,
                    `Expires in **${expireIn()}**!`
                ].join("\n")
            )
            .setFooter({ text: "Free nitro!" })
            .setColor(`${client.color.invisible}`)
            .setThumbnail("https://media.discordapp.net/attachments/895163964361674752/895982514093555763/images_1_-_2021-10-08T160355.540.jpeg")

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("nitro")
                    .setStyle("SUCCESS")
                    .setLabel("Claim")
            )

        let msg = await message.reply({ embeds: [nitroEmbed], components: [row] })

        const collector = msg?.createMessageComponentCollector({
            time: 30000,
            componentType: "BUTTON"
        })

        collector?.on("collect", (i) => {
            if (i.user.id !== message.author.id) return i.reply({ content: "This isn't your menu!", ephemeral: true })
            const rickroll = 'https://imgur.com/NQinKJB'
            msg.edit({ embeds: [], content: rickroll, components: [] })
        })

    }
}