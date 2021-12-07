const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const db = require("../../models/MemberRoles.js")

module.exports = {
    name: 'unmute',
    category: 'moderation',
    description: `Unmutes an user`,
    usage: `[user]`,
    cooldown: 3000,
    userPermissions: ["BAN_MEMBERS"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, missingpartembed) => {

        var user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
        if (!args[0]) return message.reply({ embeds: [missingpartembed] })

        let erm = new MessageEmbed().setDescription("This user isn't in this guild!").setColor(`RED`)
        if (!user) return message.reply({ embeds: [erm] }).then((msg) => {
            setTimeout(() => {
                msg?.delete()
                message?.delete()
            }, 5000)
        })

        db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;

            if (data) {

                data.roles.map((w, i) => user.roles.set(w))
                user.roles.remove("795353284042293319")
                await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })

                let mue = new MessageEmbed()
                    .setDescription(`${user.user} has been **unmuted**`)
                    .setColor(`${client.color.moderation}`)
                let msg = await message.channel.send({ embeds: [mue] }).then(message.delete())

                const log = new MessageEmbed()
                    .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                    .setTitle(`➜ Unmute`).setURL(`${client.server.invite}`)
                    .setColor(`${client.color.unmute}`)
                    .addField("➜ User", `• ${user.user}\n• ${user.user.tag}\n• ${user.user.id}`, true)
                    .addField("➜ Moderator", `• ${message.author}\n• ${message.author.tag}\n• ${message.author.id}`, true)

                const rowlog = new MessageActionRow().addComponents(

                    new MessageButton()
                        .setLabel("Jump to the action")
                        .setStyle("LINK")
                        .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

                )

                client.webhook.moderation.send({ embeds: [log], components: [rowlog] })

            } else {

                const embed = new MessageEmbed().setDescription(`This user is not muted!`).setColor("RED")
                return message.reply({ embeds: [embed] }).then((msg) => {
                    setTimeout(() => {
                        msg?.delete()
                        message?.delete()
                    }, 5000)
                })

            }


        })


    }
}