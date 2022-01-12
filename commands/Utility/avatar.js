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

        let user;
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (member) user = message.mentions.users.first() || message.guild.members.cache.get(args[0]).user
        if (!member) {
            user = await client.users.fetch(`${args[0]}`).catch(() => { })
        }
        if (!args[0]) {
            member = message.member,
                user = message.author;
        }
        if (!member && !user) return message.reply("This user doesn't exist!")

        var rowNoNitro = new MessageActionRow().addComponents(
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
                        {
                            label: "Jpeg",
                            value: "jpeg",
                            description: `${user.username} avatar in .jpeg format`,
                            emoji: "🖼️"
                        },
                    ]
                )
        )

        var rowNitro = new MessageActionRow().addComponents(
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
                            label: "Gif",
                            value: "gif",
                            description: `${user.username} avatar in .gif format`,
                            emoji: "🖼️"
                        },
                    ]
                )
        )

        let avatarEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setURL(`${client.server.invite}`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setFooter({ text: `Selected Format: .webp` })

        const checkForNitro = user.displayAvatarURL({ dynamic: true }).endsWith(".gif") ? rowNitro : rowNoNitro;
        let msg = await message.reply({ embeds: [avatarEmbed], components: [checkForNitro] })

        const collector = msg.createMessageComponentCollector({
            componentType: "SELECT_MENU",
            time: 30000,
        });


        collector.on('collect', (collected) => {

            if (collected.customId === "avatar") {

                if (collected.user.id !== message.author.id) return collected.reply({ content: "This menu isn't for you!", ephemeral: true })

                switch (collected.values[0]) {
                    case "webp":
                        const embed1 = avatarEmbed
                            .setImage(`${user.displayAvatarURL({ size: 1024, format: 'webp' })}`)
                            .setDescription(`[Click me to download this avatar!](${user.displayAvatarURL({ size: 1024, format: 'webp' })})`)
                            .setFooter({ text: "Selected Format: .webp" });
                        msg.edit({ embeds: [embed1] })
                        collected.deferUpdate()
                        break;

                    case "png":
                        const embed2 = avatarEmbed
                            .setImage(`${user.displayAvatarURL({ size: 1024, format: 'png' })}`)
                            .setDescription(`[Click me to download this avatar!](${user.displayAvatarURL({ size: 1024, format: 'png' })})`)
                            .setFooter({ text: "Selected Format: .png" });
                        msg.edit({ embeds: [embed2] })
                        collected.deferUpdate()
                        break;

                    case "jpg":
                        const embed3 = avatarEmbed
                            .setImage(`${user.displayAvatarURL({ size: 1024, format: 'jpg' })}`)
                            .setDescription(`[Click me to download this avatar!](${user.displayAvatarURL({ size: 1024, format: 'jpg' })})`)
                            .setFooter({ text: "Selected Format: .jpg" });
                        msg.edit({ embeds: [embed3] })
                        collected.deferUpdate()
                        break;

                    case "jpeg":
                        const embed4 = avatarEmbed
                            .setImage(`${user.displayAvatarURL({ size: 1024, format: 'jpeg' })}`)
                            .setDescription(`[Click me to download this avatar!](${user.displayAvatarURL({ size: 1024, format: 'jpeg' })})`)
                            .setFooter({ text: "Selected Format: .jpeg" });
                        msg.edit({ embeds: [embed4] })
                        collected.deferUpdate()
                        break;

                    case "gif":
                        const embed5 = avatarEmbed
                            .setImage(`${user.displayAvatarURL({ size: 1024, format: 'gif', dynamic: true })}`)
                            .setDescription(`[Click me to download this avatar!](${user.displayAvatarURL({ size: 1024, dynamic: true, format: "gif" })})`)
                            .setFooter({ text: "Selected Format: .gif" });
                        msg.edit({ embeds: [embed5] })
                        collected.deferUpdate()
                        break;

                }
            }
        })

        collector.on("end", () => {
            msg.edit({ components: [] })
        })
    }
}