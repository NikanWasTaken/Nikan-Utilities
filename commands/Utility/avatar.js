const { MessageEmbed, Client, Message, MessageActionRow, MessageSelectMenu } = require('discord.js')

module.exports = {
    name: 'avatar',
    category: 'utility',
    description: `Shows a user's avatar/profile picture.`,
    aliases: ["av", "pfp"],
    cooldown: 5000,
    usage: `[user]`,
    botCommand: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        const user = message.mentions.users.first() || await client.users.fetch(`${args[0] || message.author.id}`)

        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("avatar")
                .setPlaceholder("Please select a format!")
                .setOptions(
                    [
                        {
                            label: "Web Page",
                            value: "webp",
                            description: `${user.username} avatar in .webp format`,
                            emoji: "🖼️"
                        },
                        {
                            label: "Png",
                            value: "png",
                            description: `${user.username} avatar in .png format`,
                            emoji: "🖼️"
                        },
                        {
                            label: "Jpg",
                            value: "jpg",
                            description: `${user.username} avatar in .jpg format`,
                            emoji: "🖼️"
                        },
                    ]
                )
        )

        const rowEnded = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("avatar")
                .setPlaceholder("Timed Out!")
                .setDisabled(true)
                .setOptions(
                    [
                        {
                            label: "Web Page",
                            value: "webp",
                            description: `${user.username} avatar in .webp format`,
                            emoji: "🖼️"
                        },
                        {
                            label: "Png",
                            value: "png",
                            description: `${user.username} avatar in .png format`,
                            emoji: "🖼️"
                        },
                        {
                            label: "Jpg",
                            value: "jpg",
                            description: `${user.username} avatar in .jpg format`,
                            emoji: "🖼️"
                        },
                    ]
                )
        )

        let avatarEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTitle(`${user.username}'s Avatar Preview`)
            .setURL(`${client.server.invite}`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setFooter(`Selected Format: .webp`)
        let msg = await message.reply({ embeds: [avatarEmbed], components: [row] })

        const collector = msg.createMessageComponentCollector({
            componentType: "SELECT_MENU",
            time: 30000,
        });


        collector.on('collect', (collected) => {

            if (collected.customId === "avatar") {
                switch (collected.values[0]) {
                    case "webp":
                        const embed1 = avatarEmbed
                            .setImage(`${user.displayAvatarURL({ size: 1024, dynamic: true })}`)
                            .setDescription(`[Click me to download this avatar!](${user.displayAvatarURL({ size: 1024, dynamic: true })})`)
                            .setFooter("Selected Format: .webp");
                        msg.edit({ embeds: [embed1] })
                        collected.deferUpdate()
                        break;

                    case "png":
                        const embed2 = avatarEmbed
                            .setImage(`${user.displayAvatarURL({ size: 1024, format: 'png' })}`)
                            .setDescription(`[Click me to download this avatar!](${user.displayAvatarURL({ size: 1024, dynamic: true })})`)
                            .setFooter("Selected Format: .png");
                        msg.edit({ embeds: [embed2] })
                        collected.deferUpdate()
                        break;

                    case "jpg":
                        const embed3 = avatarEmbed
                            .setImage(`${user.displayAvatarURL({ size: 1024, format: 'jpg' })}`)
                            .setDescription(`[Click me to download this avatar!](${user.displayAvatarURL({ size: 1024, dynamic: true })})`)
                            .setFooter("Selected Format: .jpg");
                        msg.edit({ embeds: [embed3] })
                        collected.deferUpdate()
                        break;

                }
            }
        })

        collector.on("end", () => {
            msg.edit({ components: [rowEnded] })
        })

    }
}