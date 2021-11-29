const db = require('../../models/warns')
const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name : 'clear-warns',
    category : 'moderation',
    description : `Delete all the warns for a member.`,
    usage:'Moderators',
    aliases : ['clearwarns', 'deletewarns', 'clear-all-warns', 'del-all-warns'],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run : async(client, message, args) => {

        let noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")

        if(!message.member.hasPermission('MOVE_MEMBERS')) return message.channel.send(noperm).then((m) => m.delete( {timeout: 5000 })).then(message.delete())
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.channel.send('Could not find that user.').then((m) => m.delete( {timeout: 5000 })).then(message.delete())
        var xx = new MessageEmbed().setDescription(`<a:red_x:872203367718457424> you can't not clear warns from people with higher or same position as yourself.`).setColor("RED")
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(xx).then(message => message.delete({timeout: 5000})).then(() => message.delete())
        db.findOne({ guildid : message.guild.id, user: user.user.id}, async(err,data) => {
            if(err) throw err;
            if(data) {
                await db.findOneAndDelete({ user : user.user.id, guildid: message.guild.id})
                message.channel.send(`Cleared ${user.user.username}'s warns`)
            } else {
                message.channel.send('This user does not have any warns in this server!')
            }
        })
    }
}