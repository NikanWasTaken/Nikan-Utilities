const { MessageEmbed, Client, Message } = require('discord.js')
const db = require("../../models/MemberRoles.js")

module.exports = {
    name: 'unmute',
    category: 'moderation',
    description: `Unmutes an user`,
    usage: `[user]`,
    cooldown: 3000,
    permissions: ["BAN_MEMBERS"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, wrongUsage) => {

        var user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
        if (!args[0]) return wrongUsage(message)

        let erm = new MessageEmbed()
            .setDescription("This user isn't in this guild!")
            .setColor(`RED`)
        if (!user) return message.reply({ embeds: [erm] })
            .then((msg) => {
                client.delete.message(message, msg)
            })

        db.findOne({ guildId: message.guildId, userId: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {

                data.roles.map((w) => user.roles.set(w))
                await data.delete();
                await user.timeout(null, "Unmute by a moderator")

                let mue = new MessageEmbed()
                    .setDescription(`${user.user} has been **unmuted**`)
                    .setColor(`${client.color.moderation}`)
                let msg = await message.channel.send({ embeds: [mue] })
                    .then(message.delete())

                client.log.action({
                    type: "Unmute",
                    color: "UNMUTE",
                    user: `${user.user.id}`,
                    moderator: `${message.author.id}`,
                    reason: `Unmutes doesn't support reasons.`,
                    id: "No ID",
                    url: `https://discord.com/channels/${message.guildId}/${message.channelId}/${msg.id}`
                })

            } else {

                const embed = new MessageEmbed()
                    .setDescription(`This user is not muted!`)
                    .setColor("RED")
                return message.reply({ embeds: [embed] }).then((msg) => {
                    client.delete.message(message, msg)
                })
            }
        })
    }
}