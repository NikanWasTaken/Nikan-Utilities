const warnModel = require("../../models/Punishments.js")
const { Message, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: 'delwarn',
    category: 'moderation',
    description: `Deletes a punishment`,
    usage: '[warn ID]',
    aliases: ['delwarn', 'deletewarn', 'delete-warn', 'rmpunish', 'rmpunishment'],
    cooldown: 10000,
    permissions: ["ADMINISTRATOR"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async ({ client, message, args, wrongUsage }) => {

        const warnId = args[0]
        if (!warnId) return message.reply({ embeds: [wrongUsage] })

        try {

            const data = await warnModel.findById(`${warnId}`)
            const user = await client.users.fetch(`${data?.userId}`) || "Can't find user!"
            data.delete()

            let embed = new MessageEmbed()
                .setDescription(`Punnishment \`${data._id}\` has been deleted!`)
                .setColor(`${client.color.moderation}`)
            let msg = await message.channel.send({ embeds: [embed] }).then(message.delete())

            client.log.action({
                type: "Punishment Remove",
                color: "DELETE",
                user: `${user.id}`,
                moderator: `${message.author.id}`,
                reason: `• ID: ${data?._id}\n• Type: ${data?.type}\n• Reason: ${data?.reason}\n• Moderator: ${(await client.users.fetch(`${data?.moderatorId}`))?.tag || "I can't find them."}`,
                id: `${data._id}`,
                url: `https://discord.com/channels/${message.guildId}/${message.channelId}/${msg.id}`
            })

        } catch (error) {

            const embed = new MessageEmbed()
                .setDescription(`A punishment with that ID doesn't exist in the database!`)
                .setColor(`RED`)
            return message.reply({ embeds: [embed] }).then((msg) => {
                client.delete.message(message, msg);
            })

        }
    }
}