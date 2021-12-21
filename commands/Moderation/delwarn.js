const warnModel = require("../../models/Punishments.js")
const { Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    name: 'delwarn',
    category: 'moderation',
    description: `Clear member's warn`,
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

        const warnId = args[0]

        if (!warnId) return message.reply({ embeds: [wrongUsage] })

        try {

            const data = await warnModel.findById(`${warnId}`)
            data.delete()

            const user = await client.users.fetch(`${data?.userId}`) || "Can't find user!"

            let embed = new MessageEmbed()
                .setDescription(`Punnishment \`${data._id}\` has been deleted!`)
                .setColor(`${client.color.moderation}`)

            await message.delete()
            let msg = await message.channel.send({ embeds: [embed] })

            const log = new MessageEmbed()
                .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                .setTitle(`➜ Punishment Removal`).setURL(`${client.server.invite}`)
                .setColor(`${client.color.remove}`)
                .addField("➜ User", `• ${user}\n• ${user.tag}\n• ${user.id}`, true)
                .addField("➜ Moderator", `• ${message.author}\n• ${message.author.tag}\n• ${message.author.id}`, true)
                .addField("➜ Punishment", `• ID: ${data?._id}\n• Type: ${data?.type}\n• Reason: ${data?.reason}\n• Moderator: ${(await client.users.fetch(`${data?.moderatorId}`))?.tag || "I can't find them."}`, false)

            const rowlog = new MessageActionRow().addComponents(

                new MessageButton()
                    .setLabel("Jump to the action")
                    .setStyle("LINK")
                    .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

            )

            client.webhook.moderation.send({ embeds: [log], components: [rowlog] })

        } catch (error) {

            const embed = new MessageEmbed().setDescription(`A punishment with that ID doesn't exist in the database!`).setColor(`RED`)
            return message.reply({ embeds: [embed] }).then((msg) => {
                setTimeout(() => {
                    msg?.delete()
                    message?.delete()
                }, 5000)
            })

        }


    }
}