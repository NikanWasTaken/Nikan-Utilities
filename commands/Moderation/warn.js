const db = require('../../models/warns')
const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name : 'warn',
    category : 'moderation',
    description : `Warn members in the server using ">warn (user) (reason)". You can use both ID and mention in the user section.`,
    usage:'Moderators',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run : async(client, message, args) => {

        let noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")

        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(noperm).then((m) => m.delete( { timeout: 5000 } )).then(message.delete())
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) return message.channel.send(`Could not find that user.`).then((m) => m.delete( { timeout: 5000 } )).then(message.delete())
        var xx = new MessageEmbed().setDescription(`<a:red_x:872203367718457424> You can't not warn people with higher or same position as yourself.`).setColor("RED")
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(xx).then(message => message.delete({timeout: 5000})).then(() => message.delete())
        const reason = args.slice(1).join(" ")
        if(!reason) return message.reply("You should provide a reason for the warn!").then((m) => m.delete( { timeout: 5000 } )).then(message.delete())
        db.findOne({ guildid: message.guild.id, user: user.user.id}, async(err, data) => {
            if(err) throw err;
            if(!data) {
                data = new db({
                    guildid: message.guild.id,
                    user : user.user.id,
                    content : [
                        {
                            moderator : message.author.id,
                            reason : reason
                        }
                    ]
                })
            } else {
                const obj = {
                    moderator: message.author.id,
                    reason : reason
                }
                data.content.push(obj)
            }
            data.save()
        });

        let warndm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL( { dynamic: true } ))
        .setTitle(`You've been warned in ${message.guild.name}.`)
        .addField("Moderator", message.author.tag)
        .addField("Reason", reason)
        .setColor("#e6cc93")

        user.send(warndm)
        let warned = new MessageEmbed()
        .setDescription(`${user} has been **warned** | ${reason}`)
        .setColor("#e6cc93")
        message.channel.send(warned)
        
    }
}