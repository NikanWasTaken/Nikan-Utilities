const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'avatar',
    category : 'member',
    description : `See user's avatar (pfp) using ">avatar (user)". You can only mention a user in the user section.`,
    usage:'<#800421771114709022>, <#844418140796092466>',
    aliases : ['av', 'pfp'],
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`

           if (message.channel.id === '800421771114709022' || message.channel.id === "844418140796092466") {
        const user = message.mentions.users.first() || message.author
        const avatarEmbed = new MessageEmbed()
            .setColor("RANDOM") 
            .setAuthor(`${user.username}'s avatar :)`, user.displayAvatarURL( { dynamic:true } ))
            .setImage(user.displayAvatarURL( { dynamic:true , size: 1024} ))
            .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL( { dynamic:true } ))
        message.channel.send(avatarEmbed)
      } else 
          message.channel.send(botcmd).then(message => message.delete({timeout: 10000})).then(message.delete())
    

    }
}