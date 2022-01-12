const { MessageEmbed, Util, Message, Client } = require('discord.js');
const added = []
const failed = []

module.exports = {
    name: `stealemojis`,
    category: 'utility',
    description: `Steal some emojis ;)`,
    cooldown: 5000,
    aliases: ["steals"],
    usage: `[emoji] [emoji] [emoji] [emoji]...`,
    permissions: ["BAN_MEMBERS"],


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, wrongUsage) => {


        for (const rawEmoji of args) {


            const parsedEmoji = Util.parseEmoji(rawEmoji);

            if (parsedEmoji.id) {

                const extension = parsedEmoji.animated ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`

                let e = await message.guild.emojis.create(url, parsedEmoji.name)
                    .catch(() => { failed.push(`${parsedEmoji}`) })
                added.push(`${e}`)

            }


        }

        const em = new MessageEmbed()
            .setColor("RED")
            .setDescription("I couldn't find any emoji in your message!")

        if (!added.length && !failed.length)
            return message.channel.send({ embeds: [em] }).then((msg) => {
                client.delete.message(message, msg)
            })

        const embed = new MessageEmbed()
            .setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}` })
            .setColor(`${client.color.serverPurple}`)

        if (added?.length)
            embed.addField(`Added [${added.length}]`, `${added.map(e => e) || "no"}`)

        if (failed?.length)
            embed.addField(`Added [${failed.length}]`, `${failed.map(e => e) || "no"}`)

        message.channel.send({ embeds: [embed] })
    }
}
