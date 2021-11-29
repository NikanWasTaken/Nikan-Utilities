const { MessageEmbed } = require('discord.js')
const math = require("mathjs")

module.exports = {
    name : 'calculate',
    category : 'utility',
    description : `Calculate things for you`,
    aliases : ['calculator', 'math'],
    usage: `[question]`,
    botCommandOnly: true,
    cooldown: 5000,
    
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args, missingpartembed) => {

        let question = args.join(" ")

              if(!question) return message.reply({ embeds: [missingpartembed]})

           try {

           var ee = new MessageEmbed()
           .setTitle("Calculator")
           .setThumbnail("https://cdn.discordapp.com/attachments/870637449158742057/870637899287244800/IMG_6787_1.png")
           .setDescription(`**Question:** ${question}\n**Answer:** ${math.evaluate(question)}\n`)
           .setColor("#4c9ad2")
           .setFooter(`Requested by ${message.member.user.username}`, message.member.user.displayAvatarURL( { dynamic:true } ))
            message.reply("Calculating...").then((m) => m.edit({embeds: [ee]}))

                   
        } catch (error) {
            message.reply("Your question is invalid!")    
        }
        

    }
}