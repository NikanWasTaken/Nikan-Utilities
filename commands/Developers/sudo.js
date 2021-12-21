const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'sudo',
    category: 'Developers',
    usage: '[user] [message]',
    developer: true,
    visible: false,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {


        let text = message.content.split(" ").slice(2).join(" ")
        let user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()

        if (!text || !args[0]) return message.delete()

        if (user) {

            message.delete()
            const name = user.displayName
            const avatar = user.user.displayAvatarURL();

            let create = await message.channel.createWebhook(`${name}`, { avatar: `${avatar}` })
            await create.send({ content: `${text}` })
            await create.delete()

        } else if (!user) {

            user = await client.users.fetch(`${args[0]}`).catch(e => { return message.delete() })
            const name = user.username;
            const avatar = user.displayAvatarURL();

            message.delete()
            let create = await message.channel.createWebhook(`${name}`, { avatar: `${avatar}` })
            await create.send({ content: `${text}` })
            await create.delete()

        }


    }
}