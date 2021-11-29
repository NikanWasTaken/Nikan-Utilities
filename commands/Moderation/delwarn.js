const warnModel = require("../../models/Punishments.js")
const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name : 'delwarn',
    category : 'moderation',
    description : `Clear member's warn`,
    usage:'[warn ID]',
    aliases : ['delwarn', 'deletewarn', 'delete-warn', 'rmpunish', 'rmpunishment'],
    cooldown: 10000,
    userPermissions: ["ADMINISTRATOR"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run : async(client, message, args, missingpartembed, modlog) => {

        const warnId = args[0]

        if(!warnId) return message.reply({ embeds: [missingpartembed]})
        const data = await warnModel.findById(warnId).catch(e => { return })
        if(!data) return message.reply("The warn ID is not valid.")
        data.delete()
 
        const user = message.guild.members.cache.get(data.userId) || "The user has left the server!"
        const embed = new MessageEmbed()
         .setDescription(`Removed the punishment with the ID \`${warnId}\`\n From the user: ${user}`)
         .setColor(`${client.embedColor.moderation}`)
        message.channel.send({ embeds: [embed]}).then(message.delete())
 
        let log = new MessageEmbed()
        .setAuthor(`Action: Remove Punishment`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setColor(`${client.embedColor.logGreen}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● ${message.member.user}\n> __Tag:__ ${message.member.user.tag}\n> __ID:__ ${message.member.user.id}`, true)
        .addField("● Punishment Info", `> Warn ID: ${warnId}.\n`, false)
        .setTimestamp()
 
        modlog.send({ embeds: [log]})

    }
}