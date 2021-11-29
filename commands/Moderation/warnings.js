const db = require('../../models/warns')
const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name : 'warnings',
    category : 'moderation',
    description : `Check member warns or your own warnings using this command.`,
    usage:'Moderators',
    aliases : ['warns', 'strikes', 'punishes', 'punishments'],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run : async(client, message, args) => {

        let noperm = new MessageEmbed()
        .setDescription('You can only see your your warnings using `>warns`.')
        .setColor("#b3666c")

        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(user) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(noperm).then((m) => m.delete( { timeout: 5000 } )).then(message.delete())
        const reason = args.slice(1).join(" ")
        db.findOne({ guildid: message.guild.id, user: user.user.id}, async(err, data) => {
            if(err) throw err;
            if(data) {
                message.channel.send(new MessageEmbed()
                    .setAuthor(`${user.user.tag} warnings in ${message.guild.name}.`, user.user.displayAvatarURL( { dynamic: true } ))
                    .setDescription(
                        data.content.map(
                            (w, i) => 
                            `\`${i + 1}\` | Moderator : ${message.guild.members.cache.get(w.moderator).user.tag}\nReason : ${w.reason}`
                        )
                    )
                    .setColor("ORANGE")
                )
            } else {
                message.channel.send(`${user.user.username} has no warn!`)
            }

        })
    } else {
        if(message.channel.id === "800421771114709022") {
        db.findOne({ guildid: message.guild.id, user: message.member.id}, async(err, data) => {
            if(err) throw err;
            if(data) {
                message.channel.send(new MessageEmbed()
                    .setAuthor(`${message.author.tag} warnings in ${message.guild.name}.`, message.author.displayAvatarURL( { dynamic: true } ))
                    .setDescription(
                        data.content.map(
                            (w, i) => 
                            `\`${i + 1}\` | Moderator : ${message.guild.members.cache.get(w.moderator).user.tag}\nReason : ${w.reason}`
                        )
                    )
                    .setColor("ORANGE")
                )
            } else {
                message.channel.send(`You have no warn!`)
            }

        })
    } else 
    message.channel.send(botcmd).then((m) => m.delete( { timeout: 5000 } )).then(message.delete())
}
     
    }
}