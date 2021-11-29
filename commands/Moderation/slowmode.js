const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'slowmode',
    category : 'moderation',
    description : `Chnage a channel's slowmode using ">sm (limit)". Limit should be in seconds.`,
    usage:'Moderators',
    aliases : ['sm'],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")



      
        var limit = args[0]
      
      
          if (message.member.hasPermission('MANAGE_MESSAGES')) {
          if (limit) {
          if(!isNaN(limit)) {
          if(limit < 21601) {
      
            if(limit == message.channel.rateLimitPerUser) return message.channel.send(`${message.author}, the current slowmode is ` + "`" + `${message.channel.rateLimitPerUser}` + "`" + ` seconds, Nothing changed.`).then(() => message.channel.setRateLimitPerUser(limit))
      
            if(limit < 1) return message.channel.send("Slowmode has been turned off, go crazy!").then(() => message.channel.setRateLimitPerUser("0"))
      
      
      
            
                message.channel.setRateLimitPerUser(limit);
                message.channel.send(`Slowmode set to ` + "`" + `${limit}` + "`" + ` seconds.`).then(() => message.channel.setRateLimitPerUser(mini))
      
            
        } else
                var qq = new MessageEmbed()
                 .setDescription("<a:red_x:872203367718457424> I can't set the slowmode more than 6 hours.")
                 .setColor("#ff0000")
                 message.channel.send(qq).then(message => message.delete({timeout: 10000}));
                 
        } else 
                var embedr = new MessageEmbed()
                 .setDescription("<a:red_x:872203367718457424> Please provide a number to set slowmode to.")
                 .setColor("#ff0000")
                 message.channel.send(embedr).then(message => message.delete({timeout: 10000}));
      
         } else 
              if(message.channel.rateLimitPerUser !==0) {
      
                 message.channel.send(`The current slowmode is **${message.channel.rateLimitPerUser}** second.`)
                  } else 
                      message.channel.send("There is no slowmode on this channel.")
      
      
        } else 
          message.channel.send(noperm).then(message => message.delete({timeout: 10000}));
      
      
      
      
      
      if (!message.guild) return;

      
    }

}