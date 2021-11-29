const { MessageEmbed } = require('discord.js')
const weather = require("weather-js");


module.exports = {
    name : `weatherinfo`,
    category : 'information',
    description : `Shows info about a country's weather`,
    aliases: ["weather-info"],
    cooldown: 5000,
    usage: `[location/city]`,
    botCommandOnly: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args, missingpartembed) => {


            if(!args) return message.reply({ embeds: [missingpartembed]})
         
          weather.find({ search: args, degreeType: 'C' }, function(error, result) {
          if (error) return message.reply(`Something Went Wrong, Try Again Later!`)
         
          if (result === undefined || result.length === 0)
          return message.reply(
          `Invalid location, please give a valid location!`)
         
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
         
          message.reply({ embeds: [Weather]})
         
          });
             
    
}
}