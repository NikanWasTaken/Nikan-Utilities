const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'achievement',
    category : 'Fun',
    description : 'Make a minecraft achievement using ">achievement (your text)".',
    usage:'<#800421771114709022>',
    aliases : ['advancement'],
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`
        let sentence = message.content.split(" ").slice(1).join("+")
    
          if (message.channel.id === '800421771114709022') {
           if (sentence) {
           if(sentence.startsWith("<@")) return message.channel.send(`${message.author}, Please don't mention someone, put a text instead.`)
           if(sentence.startsWith("<#")) return message.channel.send(`${message.author}, Please don't put a chnanel, put a text instead.`)
           if (sentence.length > 22) return message.channel.send(`${message.author}, Please specify a text lower than 22 characters.`)
            let embed = new MessageEmbed()
             .setImage(`https://api.cool-img-api.ml/achievement?text=${sentence}`)
             .setColor("RANDOM")
           message.channel.send(embed)
           } else 
           message.channel.send(`${message.author}, Please specify a text.`).then(message => message.delete({timeout: 10000}));
          } else
           message.channel.send(botcmd).then(message => message.delete({timeout: 10000}));
       }

}