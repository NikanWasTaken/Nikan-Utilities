const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'lock',
    category : 'moderation',
    description : `Locking channels and don't let people chat in them using ">lock (reason)" in that channel you want to lock.`,
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

        var reason = message.content.split(" ").slice(1).join(" ")

        if (message.member.hasPermission('BAN_MEMBERS')) {
            if(reason) {
        
        
          var hii = new Discord.MessageEmbed()
           .setAuthor("Channel Locked", client.user.displayAvatarURL( { dynamic:true } ))
           .setDescription("This channel has been locked by a staff member. You are not muted.\nMore information will be sent here eventually.")
           .setColor("#e6cc93")
           .addFields({
             name: "Reason",
             value: reason
           })
        
          message.channel.send(hii)
        
          message.channel.updateOverwrite(message.guild.roles.everyone, {
          SEND_MESSAGES: false
         });
          message.channel.updateOverwrite(message.guild.roles.cache.get("814178652869623888"), {
          SEND_MESSAGES: true
         });
          message.channel.updateOverwrite(message.guild.roles.cache.get("819205048872992768"), {
          SEND_MESSAGES: true
         });
        
        
        
          } else 
             var yy = new Discord.MessageEmbed()
              .setDescription("<a:red_x:872203367718457424> You should Provide a reason for locking the channel.")
              .setColor("#ff0000")
             message.channel.send(yy).then(message => message.delete({timeout: 10000}));
        
                 
          } else 
               message.channel.send(noperm).then(message => message.delete({timeout: 10000}));

    }
}