const { MessageEmbed } = require('discord.js')
const fetch = require("node-fetch")

module.exports = {
    name : 'google',
    category : 'member',
    description : `Search things in google using ">google (search title)".`,
    usage:'<#800421771114709022>, <#844418140796092466>',
    aliases: ['search'],
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {


        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`

        let sentence = message.content.split(" ").slice(1).join('+')
        let lentence = message.content.split(" ").slice(1).join(" ")
        let spotify = message.content.split(" ").slice(1).join("%20")
        let wiki = message.content.split(" ").slice(1).join("_")
      
      
         if(message.channel.id === "800421771114709022" || message.channel.id === "844418140796092466") {
        if (!sentence) return message.channel.send(`${message.author}, Please write a text to google.`).then(message => message.delete({timeout: 7000}));
        if(sentence.startsWith("<@")) return message.channel.send(`${message.author}, You can't google discord users.`).then(message => message.delete({timeout: 7000}));
        if(sentence.startsWith("<#")) return message.channel.send(`${message.author}, You can't google discord channels.`).then(message => message.delete({timeout: 7000}));
        if(sentence.startsWith("discord.gg")) return message.channel.send(`${message.author}, You can't google discord invites.`) .then(message => message.delete({timeout: 7000}));
      else 
       if(sentence.startsWith("https://")) return message.channel.send(`${message.author}, You can't google links.`).then(message => message.delete({timeout: 7000}));
       if(sentence.startsWith("http://")) return message.channel.send(`${message.author}, You can't google links.`).then(message => message.delete({timeout: 7000})); 
      
      
         var rr = new MessageEmbed()
          .setTitle(lentence)
          .setColor("RANDOM")
          .setFooter(`Searched by ${message.author.tag}`)
          .setTimestamp()
          .setDescription(`__Basic Results:__\n**All:** ` + `[[Click Here]](https://www.google.com/search?q=${sentence})` + '\n**Image:** ' + `[[Click Here]](https://www.google.com/search?q=${sentence}&rlz=1C5CHFA_enIR915IR915&sxsrf=ALeKk02YnMIylrIaOo00gSyS6H5VsiWWJw:1618913218793&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjf8c_ayYzwAhXj_rsIHbSPBEoQ_AUoBHoECAEQBg&biw=1440&bih=796)` + `\n**Video:** ` + `[[Click Here]](https://www.google.com/search?q=${sentence}&source=lmns&tbm=vid&bih=796&biw=1440&rlz=1C5CHFA_enIR915IR915&hl=en&sa=X&ved=2ahUKEwjpk9X9yYzwAhXQkKQKHQEPCZ8Q_AUoA3oECAEQAw)` + '\n**Youtube:** ' + `[[Click Here]](https://www.youtube.com/results?search_query=${sentence})` + '\n\n__Additional Results:__\n**Spotify:** ' + `[[Click Here]](https://open.spotify.com/search/${spotify})` + `\n**Amazon:** ` + `[[Click Here]](https://www.amazon.com/s?k=${sentence})` + "\n**Wikipedia:** " + `[[Click Here]](https://en.wikipedia.org/wiki/${wiki})`)
        message.channel.send("Preparing your search results...").then((message)=> message.edit(rr))
         } else
          message.channel.send(botcmd).then(message => message.delete({timeout: 5000})).then(messages.delete())
      }

      

}