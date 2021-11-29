const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'ascii',
    category : 'Fun',
    description: 'Turn texts to ascii arts using ">ascii (text)"',
    usage: 'Bot-commands',
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

      const figlet = require('figlet'); 
             
      let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`
      
              if(message.channel.id === "800421771114709022" || message.channel.id === "844418140796092466") {
              if(!args[0]) return message.channel.send('Please provide some text');
      
              msg = args.join(" ");
              
              figlet.text(msg, function (err, data){
                  if(err){
                      console.log('Something went wrong');
                      console.dir(err);
                  }
                  if(data.length > 2000) return message.channel.send('Please provide text shorter than 2000 characters')
      
                  message.channel.send('```' + data + '```')
              })
            } else 
             message.channel.send(botcmd).then(message => message.delete({timeout: 5000})).then(message.delete())
          

        }
    
}