const { MessageEmbed, Util } = require('discord.js');
const added = [];
const failed = [];

module.exports = {
    name: `stealemoji`,
    category: 'utility',
    description: `Steal some emojis ;)`,
    cooldown: 5000,
    usage: `[emoji]<emoji><emoji>...`,
    userPermissions: ["BAN_MEMBERS"],


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, missingpartembed) => {


        if (!args.length) return message.reply({ embeds: [missingpartembed] })

        for (const rawEmoji of args) {


            const parsedEmoji = Util.parseEmoji(rawEmoji);

            if (parsedEmoji.id) {

                const extension = parsedEmoji.animated ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`

                let e = await message.guild.emojis.create(url, parsedEmoji.name).catch(e => { failed.push(`${parsedEmoji}`) })
                added.push(`${e}`)

            }


        }

        const em = new MessageEmbed()
            .setColor("RED")
            .setDescription("I couldn't find any emoji in your message!")

        if (!added.length && !failed.length) return message.channel.send({ embeds: [em] }).then((msg) => {
            setTimeout(() => {
                msg?.delete()
                message?.delete()
            }, 5000)
        })

        const embed = new MessageEmbed()
            .setAuthor(`${message.guild.name}`, `${message.guild.iconURL({ dynamic: true })}`)
            .setColor(`${client.color.cool}`)

        if (added?.length)
            embed.addField(`Added [${added.length}]`, `${added.map(e => e) || "no"}`)

        if (failed?.length)
            embed.addField(`Added [${failed.length}]`, `${failed.map(e => e) || "no"}`)

        message.channel.send({ embeds: [embed] })


    }
}
