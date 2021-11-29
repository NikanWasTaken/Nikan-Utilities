const { MessageEmbed } = require('discord.js')
const fetch = require("node-fetch")

module.exports = {
    name : 'color',
    category : 'member',
    description : `Information is given to you about the hex color that you gave the bot.`,
    usage:'<#800421771114709022>, <#844418140796092466>',
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`

            if(message.channel.id !== "800421771114709022") return message.channel.send(botcmd).then((m) => m.delete({timeout: 5000})).then(message.delete())
           if(!args[0]) return message.reply("Please provide a hex code!").then((m) => m.delete({timeout: 5000})).then(message.delete())
                var color = args[0]
                if (color.includes("#")) {
                    color = args[0].split("#")[1]
                }
         const url = (`https://api.alexflipnote.dev/colour/${color}`)
         let json
                try{
                    json = await fetch(url).then(res => res.json())
                }
                catch(e) {
                    return message.reply('An Error Occured, Try Again Later.')
                }
        if (json.description) return message.reply("Invalid hex code (color)").then((m) => m.delete({timeout: 5000})).then(message.delete())
         let embed = new MessageEmbed()
         .setTitle(json.name)
         .addField("RGB", json.rgb, true)
         .addField("Brightness", json.brightness, true)
         .addField("Hex", json.hex, true)
         .setThumbnail(json.image)
         .setImage(json.image_gradient, true)
         .setColor(json.hex)
         message.channel.send(embed)
          }

          
}