const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'chaos',
    category : 'Fun',
    description : `The bot gives you a random text and you should find 2 words in that.`,
    usage:'<#800421771114709022>, <#844418140796092466>',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

     run : async(client, message, args) => {

        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`

        if(message.channel.id === "800421771114709022" || message.channel.id === "844418140796092466") {
            const { ChaosWords } = require("weky")
            var randomWords = require('random-words');
            const words = randomWords(2) //generating 2 words
          await new ChaosWords({
                message: message,
                maxTries: 5, //max number  of user's tries (ends when reach limit)
                charGenerated: 20, //length of sentence (small length might throw error)
                words: words, //words (array) => ['word']
                embedTitle: 'Chaos words!', //understable
                embedFooter: 'Find the words in the sentence!',
                embedColor: 'RANDOM'
            }).start()
           } else 
            return message.channel.send(botcmd).then(msg => msg.delete({timeout: 5000})).then(message.delete())

     }
    }