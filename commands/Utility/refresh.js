const { MessageEmbed } = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name : 'refresh',
    category : 'Bot Developer',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let Discord = require("discord.js")
        

        
        
            let noperm = new MessageEmbed()
            .setDescription(`You don't have permissions to run this command.`)
            .setColor("#b3666c")
        
         let msg = message
    

        
        
         if (msg.author.id === "757268659239518329"){
        
         var rr = new Discord.MessageEmbed()
          .setTitle("Refresh the bot?")
          .setDescription("<a:green_check:872203367047397426> Refresh the bot.\n<a:red_x:872203367718457424> Cancel the progress.")
          .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
          .setColor("#e6cc93")
         msg.channel.send(rr).then(async (msg) => {
                  msg.react("✅")
              msg.react("❌")
            const filter = (reaction, user) => {
            return user.id === message.author.id
        };
        
        const collector = msg.createReactionCollector(filter, { time: 150000 });
        
        collector.on('collect', (reaction, user) => {
        
            if (reaction.emoji.name === "❌"){
            var ee = new Discord.MessageEmbed()
            .setDescription("Refreshing process has been canceled.")
            .setColor("#ff0000")
             msg.edit(ee).then(msg => msg.delete({timeout: 4000}));
           msg.reactions.removeAll()
            }
        
            if (reaction.emoji.name === "✅"){
        
           var loo = new Discord.MessageEmbed()
            .setDescription("<a:yesbot:872203367869448243> Refreshing the bot.")
            .setColor("#d5a538")
        
        
           var too = new Discord.MessageEmbed()
            .setDescription("<a:green_check:872203367047397426> Refresh completed.") 
            .setColor("#75fba2")
        
             msg.edit(loo)
           .then(() => client.destroy())
           .then(() => client.login(config.token))
           .then(() => msg.edit(too))
           msg.reactions.removeAll()
           
            }
        
        
        })
        })
        
         } else 
          msg.channel.send(noperm).then(msg => msg.delete({timeout: 10000}));
        
        

        
        
        
              
    }
}