const { MessageEmbed } = require('discord.js')
const translate = require("@iamtraction/google-translate")


module.exports = {
    name : `translate`,
    category : 'member',
    description : `Translate your text to the custom language using ">translate (language) (text)".`,
    usage:'<#800421771114709022>, <#844418140796092466>',
    aliases:['translator'],
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        const query = message.content.split(" ").slice(2).join(" ")

          if(message.channel.id === "800421771114709022" || message.channel.id === "844418140796092466") {
       
            
            let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`
       
           var li = new MessageEmbed()
           .setDescription(`Please provide a valid language code, visit ` + `[**here**](https://developers.google.com/admin-sdk/directory/v1/languages)` + ' for more info about language codes.')
           .setColor("#ff0000")
       
       
       
               try {
                 
               let language = message.content.split(" ").slice(1)[0]
               if(!language){ return message.channel.send(lii).then(message => message.delete({timeout: 10000}))}
       
               if(!query){ return message.channel.send(`${message.author}, Please provide a text to translate.`).then(message => message.delete({timeout: 7000}))}
                 
               var translated = await translate(query, { to: `${language}` })
               
               const translateEmbed = new MessageEmbed()
               .setTitle("Translate")
               .setThumbnail("https://cdn.discordapp.com/attachments/870637449158742057/870637829045239868/Translate_Icon.png")
                .setDescription(`**Nikan's Utilities inbuilt translator**\n\n**Sentence** - ${query}\n**Translated** - ${translated.text}\n`)
               .setColor("#5894f4")
               .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL( { dynamic:true } ))
               message.channel.send("Translating...").then((message)=> message.edit(translateEmbed))
             } catch (error) {
                
               message.channel.send(li).then(message => message.delete({timeout: 10000}))}
       
          } else 
           message.channel.send(botcmd).then(message => message.delete({timeout: 7000}))
       
         }

         
}