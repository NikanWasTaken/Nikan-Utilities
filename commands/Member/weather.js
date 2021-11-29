const { MessageEmbed } = require('discord.js')
const weather = require("weather-js");


module.exports = {
    name : `weather`,
    category : 'member',
    description : `Check a country's weather using this command.`,
    usage:'<#800421771114709022>, <#844418140796092466>',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {


        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`


        if (message.channel.id === '800421771114709022' || message.channel.id === "844418140796092466") {
        if (!args[0]) return message.channel.send(`${message.author} | Please Give a Location!`).then(message => message.delete({timeout: 10000}));
       
        weather.find({ search: args, degreeType: 'C' }, function(error, result) {
        if (error) return message.channel.send(`${message.author} | Something Went Wrong, Try Again Later!`).then(message => message.delete({timeout: 10000}));
       
        if (result === undefined || result.length === 0)
        return message.channel.send(
        `${message.author} | Invalid Location, Please Give Valid Location!`).then(message => message.delete({timeout: 10000}));
       
        var current = result[0].current;
        var location = result[0].location;
       
        const Weather = new MessageEmbed()
        .setColor("#e6cc93")
        .setTitle(`${location.name} Weather!`)
        .setDescription(`Temperature units can may be differ some time`)
        .setThumbnail(current.imageUrl)
        .addField("Sky Mod", current.skytext, true)
        .addField("Temperature", `${current.temperature}° Celcius`, true)
        .addField("Humidity", `${current.humidity}%`, true)
        .addField("Wind Speed", current.windspeed, true)
        .addField("Wind Desplay", current.winddisplay, true)
        .addField("Feels Like", `${current.feelslike}° Celcius`, true)
        .addField("Timezone", `UTC${location.timezone}`, true)
       
        .setTimestamp();
       
        message.channel.send(`Searching for ${args}'s weather, this may took a while...`).then((message) => message.edit(Weather))
       
        });
       
        } else
         message.channel.send(botcmd).then(message => message.delete({timeout: 10000}));
        }

        
    
}