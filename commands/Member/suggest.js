const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'suggest',
    category : 'member',
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

      let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`


            if(message.channel.id !== "800421771114709022") return message.channel.send(botcmd).then((m) => m.delete( { timeout: 5000} )).then(message.delete())
            let suggestion = message.content.split(" ").slice(1).join(" ")
            if(!suggestion) return message.channel.send("Please provide a suggestion after the command.").then((m) => m.delete( { timeout: 5000 })).then(message.delete())
            message.channel.send("Thanks for your suggestion, it has been posted in <#851317000868462633>.")
         
         
            let pp = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL( { dynamic: true }))
            .setDescription(suggestion)
            .setTitle("New Suggestion")
            .setURL("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.umassmed.edu%2Fit%2Fwho-we-are%2Fengage-it%2Fsuggestit%2F&psig=AOvVaw2zKCQWHASWk-vI74acS4sR&ust=1627674157081000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCLi_6_GEifICFQAAAAAdAAAAABAD")
            .setColor("#7788d4")
            message.guild.channels.cache.get("851317000868462633").send(pp).then((msg) => {
              msg.react("🔼")
              msg.react("🔽")
            })
          
         

        }
    
}
