const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")
const blacklist = require("../../models/mod-blacklist")

module.exports = {
    name : 'modmail-blacklist',
    category : 'modmail',
    usage:'Admins',
    description: `If you're a staff member, check <#844411805099229194> for this command information.`,
    aliases:["blacklist-add", "add-blacklist", "blacklist"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(noperm).then(message => message.delete({timeout: 5000})).then(() => message.delete())
        if(message.channel.id !== "844418140796092466") return message.channel.send("You can only use this commabd in staff commands channel!")
        const User = message.guild.members.cache.get(args[0])
        if(!User) return message.channel.send('User is not valid.')

        blacklist.findOne({ id : User.user.id }, async(err, data) => {
            if(err) throw err;
            if(data) {
               return  message.channel.send(`**${User.displayName}** has already been blacklisted from opening modmail`)
            } else {
                data = new blacklist({ id : User.user.id })
                data.save()
                .catch(err => console.log(err))
            message.channel.send(`${User.user.tag} has been added to modmail blacklist.`)
            }
           
        })

    }

}
