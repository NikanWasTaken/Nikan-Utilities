const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")
const { inspect } = require("util")

module.exports = {
    name : 'eval',
    category : 'Bot Developer',
    usage:'Owner, Bot developers',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")

        let code = message.content.split(" ").slice(1).join(" ")
        
            if(message.author.id === "757268659239518329" || message.author.id === "534020187192819722") {
            if(!code) return message.channel.send("Please provide some code to evaluate.").then(message => message.delete({timeout: 7000}))
          
          
          
            try {
           
          
                const result = eval(code)
              if(typeof output !== "string") {
               output = inspect(result)
              }
          
          
              if(result != "[object Promise]") {
          
           var evalrr = new MessageEmbed()
           .setAuthor(`Evolution`, message.author.displayAvatarURL( { dynamic:true } ))
           .setDescription(`📥 **Input** 📥\n` + "```js\n" + code + "\n```" + "\n📤 **output** 📤\n" + "```\n" + result + "\n```")
           .setFooter(`OutCome: Successful`, "https://cdn.discordapp.com/attachments/870637449158742057/870637996104384562/aaaaa.gif")
           .setTimestamp()
           .setColor("#75fba2")
              message.channel.send(evalrr)
          
              } else 
               var pipe = new MessageEmbed()
           .setAuthor(`Evolution`, message.author.displayAvatarURL( { dynamic:true } ))
           .setDescription(`📥 **Input** 📥\n` + "```js\n" + code + "\n```" + "\n📤 **output** 📤\n" + "```js\n" + result + "```\n")
           .setFooter(`OutCome: Successful - No output`, "https://cdn.discordapp.com/attachments/870637449158742057/870638003377307699/fffff.gif")
           .setTimestamp()
           .setColor("#e6cc93")
          
              message.channel.send(pipe)
            } catch (error) {
          
              message.channel.send(pipe)
          
          
           var frack = new MessageEmbed()
           .setAuthor(`Evolution`, message.author.displayAvatarURL( { dynamic:true } ))
           .setDescription(`📥 **Input** 📥\n` + "```js\n" + code + "\n```" + "\n📤 **output** 📤\n" + "```diff\n" + "- Try another code to evaluate \n```")
           .setFooter(`OutCome: Failed`, "https://cdn.discordapp.com/attachments/870637449158742057/870638011522613248/frrrrr.gif")
           .setTimestamp()
           .setColor("#ff0000")
           message.channel.send(frack).then((me) => me.delete( { timeout: 7000 } )).then(() => message.delete())
          
            
              } 
            } else 
            return message.channel.send(noperm).then((m) => m.delete( { timeout: 5000 } )).then(() => message.delete())
          
          }

          


    
    }
