const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'purge',
    category : 'moderation',
    description : `Purging or clearing messages in a channel using ">purge (number of messages)"`,
    usage:'Moderators',
    aliases : ['clear'],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")

        var modlog = new Discord.WebhookClient('842688628472021022', 'SSimpYCciyQL06O-XO0tSBS9BoLFzOv__kh7MD9_0F3pvp3elU_tYldf82lpoUEOICQo');
        
        var clear = args[0]
        var mod = message.author
      
      
       if(message.member.hasPermission("BAN_MEMBERS")) {
       if(!isNaN(clear)) {
       if(clear) {
       if(clear < 100) {
       
       message.channel.bulkDelete(clear)
        let embeda = new MessageEmbed()
         .setDescription(`${clear} messages have been purged.`)
         .setColor("#e6cc93")
       message.channel.send(embeda).then(message => message.delete({timeout: 5000}));
       message.delete()
      
              let embedz = new MessageEmbed()
               .setTitle("Purge")
               .setColor("#f6c744")
               .setTimestamp()
               .addFields({
                name: 'The number',
                value: `${clear} messages`,
                inline: true
                }, {
                name: 'Moderator',
                value: `${mod}`,
                inline: true
                }, {
                name: 'Channel',
                value: `${message.channel}`,
                inline: true
                });
       modlog.send(embedz)
      
      
       } else
        var ee = new MessageEmbed()
         .setDescription("<a:red_x:872203367718457424> I can't purge more than 100 messages.")
         .setColor("#ff0000")
        message.channel.send(ee).then(message => message.delete({timeout: 10000}));
        message.delete()
      
      
       } else 
        var dd = new MessageEmbed()
         .setDescription("<a:red_x:872203367718457424> Please provide a number to purge.")
         .setColor("#ff0000")
        message.channel.send(dd).then(message => message.delete({timeout: 10000}));
        message.delete()
      
       } else 
        var ddd = new MessageEmbed()
         .setDescription("<a:red_x:872203367718457424> Please provide a number to purge.")
         .setColor("#ff0000")
        message.channel.send(ddd).then(message => message.delete({timeout: 10000}));
        message.delete()
      
       } else 
        message.channel.send(noperm).then(message => message.delete({timeout: 10000}));
        message.delete()

        
       
}
}