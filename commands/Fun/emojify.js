const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'emojify',
    category : 'Fun',
    description : `Turn your text into emojis using ">emojify (text)".`,
    usage:'<#800421771114709022>, <#844418140796092466>',
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {


        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`
            if(message.channel.id === "800421771114709022" || message.channel.id === "844418140796092466") {
          if(!args.length) return message.reply('Please specify a text to turn it into emojis.').then(message => message.delete({timeout: 7000}))
          const specialCodes = {
              '0': ':zero:',
              '1': ':one:',
              '2': ':two:',
              '3': ':three:',
              '4': ':four:',
              '5': ':five:',
              '6': ':six:',
              '7': ':seven:',
              '8': ':eight:',
              '9': ':nine:',
              '#': ':hash:',
              '*': ':asterisk:',
              '?': ':grey_question:',
              '!': ':grey_exclamation:',
              ' ': '   '
            }
          const text = args.join(" ").toLowerCase().split('').map(letter => {
              if(/[a-z]/g.test(letter)) {
                  return `:regional_indicator_${letter}:`
              } else if (specialCodes[letter]) {
                  return `${specialCodes[letter]}`
              }
              return letter;
          }).join('');
  
          message.channel.send(text)
  
            } else
             message.channel.send(botcmd).then(message => message.delete({timeout: 7000}))
  

    }
}