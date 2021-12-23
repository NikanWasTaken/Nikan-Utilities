const { MessageEmbed, Util, Message, Client } = require('discord.js');

module.exports = {
    name: `stealemoji`,
    category: 'moderation',
    description: `Steal some emojis ;)`,
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


        if (!args.length) return message.reply({ embeds: [wrongUsage] })
        const name = args[0]
        const emoji = message.content.split(" ").slice(2).join(" ")

        if (!args[0]) return message.reply({ embeds: [wrongUsage] })
        if (!args[1] && !message.attachments.first()) return message.reply({ embeds: [wrongUsage] })


        if (args[1]) {

            const parse = Util.parseEmoji(`${emoji}`)

            if (parse.id) {

                try {

                    const extension = parse.animated ? ".gif" : ".png";
                    const url = `https://cdn.discordapp.com/emojis/${parse.id + extension}`

                    let emoji = await message.guild.emojis.create(`${url}`, name)

                    const embed = new MessageEmbed()
                        .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                        .setTitle("Emoji Added")
                        .setColor("GREEN")
                        .setURL(`https://discord.com/emojis/${emoji.id}`)
                        .addField("Emoji", `${emoji}`, true)
                        .addField("Name", `${emoji.name}`, true)
                        .addField("URL", `[Emoji URL](${emoji.url})`, true)

                    message.channel.send({ embeds: [embed] })

                } catch (error) {

                    const embed = new MessageEmbed()
                        .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
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
                        .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                        .setTitle("Emoji Added")
                        .setColor("GREEN")
                        .setURL(`https://discord.com/emojis/${emoji.id}`)
                        .addField("Emoji", `${emoji}`, true)
                        .addField("Name", `${emoji.name}`, true)
                        .addField("URL", `[Emoji URL](${emoji.url})`, true)

                    message.channel.send({ embeds: [embed] })

                } catch (error) {

                    const embed = new MessageEmbed()
                        .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                        .setTitle("Steal Failed!")
                        .setColor("RED")
                        .addField("Action Failed", `The emoji add action has been failed, this might happen if\n> ➜ The server has reached max emoji alots\n> ➜ The file size is more than standard\n> ➜ Other reasons...`, false)
                        .addField("Error", `\`\`\`js\n${error}\n\`\`\``, false)
                    message.channel.send({ embeds: [embed] })

                }

            }

        } else if (!args[1]) {

            if (!message.attachments.first()) return message.reply({ embeds: [wrongUsage] })

            try {

                const newemoji = (await message.attachments.first()).url;
                const emoji = await message.guild.emojis.create(`${newemoji}`, name)

                const embed = new MessageEmbed()
                    .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                    .setTitle("Emoji Added")
                    .setColor("GREEN")
                    .setURL(`https://discord.com/emojis/${emoji.id}`)
                    .addField("Emoji", `${emoji}`, true)
                    .addField("Name", `${emoji.name}`, true)
                    .addField("URL", `[Emoji URL](${emoji.url})`, true)

                message.channel.send({ embeds: [embed] })

            } catch (error) {

                const embed = new MessageEmbed()
                    .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                    .setTitle("Steal Failed!")
                    .setColor("RED")
                    .addField("Action Failed", `The emoji add action has been failed, this might happen if\n> ➜ The server has reached max emoji alots\n> ➜ The file size is more than standard\n> ➜ Other reasons...`, true)
                    .addField("Error", `\`\`\`js\n${error}\n\`\`\``, false)
                message.channel.send({ embeds: [embed] })

            }


        }



























        // for (const rawEmoji of args) {


        //     const parsedEmoji = Util.parseEmoji(rawEmoji);

        //     if (parsedEmoji.id) {

        //         const extension = parsedEmoji.animated ? ".gif" : ".png";
        //         const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`

        //         let e = await message.guild.emojis.create(url, parsedEmoji.name).catch(e => { failed.push(`${parsedEmoji}`) })
        //         added.push(`${e}`)

        //     }


        // }

        // const em = new MessageEmbed()
        //     .setColor("RED")
        //     .setDescription("I couldn't find any emoji in your message!")

        // if (!added.length && !failed.length) return message.channel.send({ embeds: [em] }).then((msg) => {
        //     setTimeout(() => {
        //         msg?.delete()
        //         message?.delete()
        //     }, 5000)
        // })

        // const embed = new MessageEmbed()
        //     .setAuthor(`${message.guild.name}`, `${message.guild.iconURL({ dynamic: true })}`)
        //     .setColor(`${client.color.cool}`)

        // if (added?.length)
        //     embed.addField(`Added [${added.length}]`, `${added.map(e => e) || "no"}`)

        // if (failed?.length)
        //     embed.addField(`Added [${failed.length}]`, `${failed.map(e => e) || "no"}`)

        // message.channel.send({ embeds: [embed] })


    }
}
