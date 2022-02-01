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
    run: async (client, message, args, wrongUsage) => {

        const warnId = args[0];
        if (!warnId) return wrongUsage(message)

        const data = await warnModel.findById(`${warnId}`).catch(() => { })

        const embedDoesntExist = new MessageEmbed()
            .setDescription(`A punishment with that ID doesn't exist in the database!`)
            .setColor(`RED`)

        if (!data)
            return message.reply({ embeds: [embedDoesntExist] }).then((msg) => {
                client.util.delete.message(message, msg);
            })

        const user = await client.users.fetch(`${data?.userId}`) || "Can't find user!"
        data.delete()

        let embed = new MessageEmbed()
            .setDescription(`Punishment \`${data._id}\` has been deleted!`)
            .setColor(`${client.color.moderation}`)
        let msg = await message.channel.send({ embeds: [embed] })
            .then(message.delete())

        client.log.action({
            type: "Punishment Remove",
            color: "DELETE",
            user: `${user.id}`,
            moderator: `${message.author.id}`,
            reason: [
                `• ID: ${data?._id}`,
                `• Type: ${data?.type}`,
                `• Reason: ${data?.reason}`,
                `• Moderator: ${(await client.users.fetch(`${data?.moderatorId}`))?.tag || "I can't find them."}`
            ].join("\n"),
            id: `${data._id}`,
            url: `https://discord.com/channels/${message.guildId}/${message.channelId}/${msg.id}`
        })
    }
}