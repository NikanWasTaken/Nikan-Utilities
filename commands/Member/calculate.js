const { MessageEmbed } = require('discord.js')
const math = require("mathjs")

module.exports = {
    name : 'calculate',
    category : 'member',
    description : `Resolve your math problem using ">calculate (question)".`,
    usage:'<#800421771114709022>, <#844418140796092466>',
    aliases : ['calculator', 'math'],
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`
        let question = message.content.split(" ").slice(1).join(" ")
       


          if(message.channel.id === "800421771114709022" || message.channel.id === "844418140796092466") {
           if(!question) return message.reply("Please provide a question after the command.").then(message => message.delete({timeout: 7000}));
          try {
           var ee = new MessageEmbed()
           .setTitle("Calculator")
           .setThumbnail("https://cdn.discordapp.com/attachments/870637449158742057/870637899287244800/IMG_6787_1.png")
           .setDescription(`**${client.user.username} inbuilt Calculator**\n\n**Question:** ${question}\n**Answer:** ${math.evaluate(question)}\n`)
           .setColor("#4c9ad2")
           .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL( { dynamic:true } ))
           message.channel.send("Calculating...").then((m) => m.edit(ee))
          } catch (error) {
           message.reply("Your question is invalid.").then(message => message.delete({timeout: 7000}));
          }
       
        } else
         message.channel.send(botcmd).then(message => message.delete({timeout:5000})).then(message.delete());
        
    

    }
}