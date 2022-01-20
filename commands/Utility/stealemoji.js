const { MessageEmbed, Util, Message, Client } = require('discord.js');

module.exports = {
    name: `stealemoji`,
    category: 'utility',
    description: `Steal a single emoji ;)`,
    cooldown: 5000,
    aliases: ["steal"],
    usage: `[emoji-name] <emoji/attachment/url>`,
    permissions: ["BAN_MEMBERS"],


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, wrongUsage) => {


        if (!args.length) return wrongUsage(message)
        const name = args[0]
        const emoji = message.content.split(" ").slice(2).join(" ")

        if (!args[0]) return wrongUsage(message)
        if (!args[1] && !message.attachments.first()) return wrongUsage(message)


        if (args[1]) {

            const parse = Util.parseEmoji(`${emoji}`)

            if (parse.id) {

                try {

                    const extension = parse.animated ? ".gif" : ".png";
                    const url = `https://cdn.discordapp.com/emojis/${parse.id + extension}`

                    let emoji = await message.guild.emojis.create(`${url}`, name)

                    const embed = new MessageEmbed()
                        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
                        .setTitle("Emoji Added")
                        .setColor("GREEN")
                        .setURL(`https://discord.com/emojis/${emoji.id}`)
                        .addField("Emoji", `${emoji}`, true)
                        .addField("Name", `${emoji.name}`, true)
                        .addField("URL", `[Emoji URL](${emoji.url})`, true)

                    message.channel.send({ embeds: [embed] })

                } catch (error) {

                    const embed = new MessageEmbed()
                        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
                        .setTitle("Steal Failed!")
                        .setColor("RED")
                        .addField("Action Failed", `The emoji add action has been failed, this might happen if\n> ➜ The server has reached max emoji alots\n> ➜ The file size is more than standard\n> ➜ Other reasons...`, false)
                        .addField("Error", `\`\`\`js\n${error}\n\`\`\``, false)
                    message.channel.send({ embeds: [embed] })

                }

            } else {

                try {

                    const newemoji = encodeURI(`${args[1]}`)
                    let emoji = await message.guild.emojis.create(`${newemoji}`, name)

                    const embed = new MessageEmbed()
                        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
                        .setTitle("Emoji Added")
                        .setColor("GREEN")
                        .setURL(`https://discord.com/emojis/${emoji.id}`)
                        .addField("Emoji", `${emoji}`, true)
                        .addField("Name", `${emoji.name}`, true)
                        .addField("URL", `[Emoji URL](${emoji.url})`, true)

                    message.channel.send({ embeds: [embed] })

                } catch (error) {

                    const embed = new MessageEmbed()
                        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
                        .setTitle("Steal Failed!")
                        .setColor("RED")
                        .addField("Action Failed", `The emoji add action has been failed, this might happen if\n> ➜ The server has reached max emoji alots\n> ➜ The file size is more than standard\n> ➜ Other reasons...`, false)
                        .addField("Error", `\`\`\`js\n${error}\n\`\`\``, false)
                    message.channel.send({ embeds: [embed] })

                }

            }

        } else if (!args[1]) {

            if (!message.attachments.first()) return wrongUsage(message)

            try {

                const newemoji = (await message.attachments.first()).url;
                const emoji = await message.guild.emojis.create(`${newemoji}`, name)

                const embed = new MessageEmbed()
                    .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTitle("Emoji Added")
                    .setColor("GREEN")
                    .setURL(`https://discord.com/emojis/${emoji.id}`)
                    .addField("Emoji", `${emoji}`, true)
                    .addField("Name", `${emoji.name}`, true)
                    .addField("URL", `[Emoji URL](${emoji.url})`, true)

                message.channel.send({ embeds: [embed] })

            } catch (error) {

                const embed = new MessageEmbed()
                    .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTitle("Steal Failed!")
                    .setColor("RED")
                    .addField("Action Failed", `The emoji add action has been failed, this might happen if\n> ➜ The server has reached max emoji alots\n> ➜ The file size is more than standard\n> ➜ Other reasons...`, true)
                    .addField("Error", `\`\`\`js\n${error}\n\`\`\``, false)
                message.channel.send({ embeds: [embed] })

            }


        }
    }
}
