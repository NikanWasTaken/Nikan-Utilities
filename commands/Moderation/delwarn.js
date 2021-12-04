const warnModel = require("../../models/Punishments.js")
const { Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    name: 'delwarn',
    category: 'moderation',
    description: `Clear member's warn`,
    usage: '[warn ID]',
    aliases: ['delwarn', 'deletewarn', 'delete-warn', 'rmpunish', 'rmpunishment'],
    cooldown: 10000,
    userPermissions: ["ADMINISTRATOR"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, missingpartembed, modlog) => {

        const warnId = args[0]

        if (!warnId) return message.reply({ embeds: [missingpartembed] })

        try {

            const data = await warnModel.findById(`${warnId}`)
            data.delete()

            const user = await client.users.fetch(`${data?.userId}`) || "Can't find user!"

            let embed = new MessageEmbed().setDescription(`➜ **From** • ${user?.tag}\n➜  **Type** • ${data.type}\n➜ **ID** • \`${data._id}\``)
                .setColor(`${client.embedColor.moderation}`)
                .setAuthor("Punishment has been removed")
                .setTimestamp()

            await message.delete()
            let msg = await message.channel.send({ embeds: [embed] })

            let log = new MessageEmbed()
                .setAuthor(`Moderation • Punishment Remove`, message.guild.iconURL({ dynamic: true }))
                .setDescription(`** **`)
                .setColor(`${client.embedColor.logs}`)
                .addField('👥 User', `Mention • ${user}\nTag • ${user.tag}\nID • ${user.id}`, true)
                .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${message.author}\nTag • ${message.author.tag}\nID • ${message.author.id}`, true)
                .addField("Punishment ID", `\`${data._id}\``)
                .setTimestamp()

            const rowlog = new MessageActionRow().addComponents(

                new MessageButton()
                    .setLabel("Jump to the action")
                    .setStyle("LINK")
                    .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

            )

            modlog.send({ embeds: [log], components: [rowlog] })

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