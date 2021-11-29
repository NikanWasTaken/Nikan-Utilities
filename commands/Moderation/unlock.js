const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'unlock',
    category : 'moderation',
    description : `Unlocking locked channels and make people chat again using ">unlock" in the channel you want to unlock.`,
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
        
        if (message.member.hasPermission('BAN_MEMBERS')) {

            message.channel.updateOverwrite(message.guild.roles.everyone, {
            SEND_MESSAGES: true
           });
          
          
           var hello = new Discord.MessageEmbed()
            .setAuthor("Channel Unlocked", client.user.displayAvatarURL( { dynamic:true } ))
            .setDescription("This channel has been unlocked by a staff member.\nYou may chat now.")
            .setFooter(`Unlocked by ${message.author.tag}`)
            .setColor("#e6cc93")
           message.channel.send(hello)
          
           } else 
             message.channel.send(noperm).then(message => message.delete({timeout: 10000}));

    }
}