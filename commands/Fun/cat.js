const axios = require('axios');
const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'cat',
    category : 'Fun',
    description : 'Sends a random cat picture.',
    aliases: ["meow"],
    usage:'<#800421771114709022>',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`
        const url = "https://some-random-api.ml/img/cat";
        const facts = "https://some-random-api.ml/facts/cat"


        if (message.channel.id !== '800421771114709022') return message.channel.send(botcmd).then((m) => m.delete( { timeout: 5000})).then(message.delete())
        
        let image, response;
        let fact, responses;
        try {
            response = await axios.get(url);
            image = response.data;

            responses = await axios.get(facts)
            fact = responses.data

        } catch (e) {
            return message.channel.send(`An error occured, please try again!`)
        }

        const embed = new MessageEmbed()
            .setTitle("🐈 Meow...")
            .setURL(image.link)
            .setColor('RANDOM')
            .setImage(image.link)

        await message.channel.send("Looking for a cat...").then((m) => m.edit("🐈 Found One!")).then((m) => m.edit(embed))
    }
}