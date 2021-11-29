const { MessageEmbed } = require('discord.js')
const Commando = require('discord.js-commando')
const axios = require('axios')

module.exports = {
    name : 'docs',
    category : 'info',
    description : 'Searches codes in discord.js.org website.',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        if (message.content.toLowerCase().startsWith('>docs')) {
            if(!args[0]) return message.reply("Please provide a discord.js code to search at discord.js.org").then((m) => m.delete( { timeout: 5000} )).then(message.delete())
             const uri = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
               args
             )}`
         
             axios
               .get(uri)
               .then((embed) => {
                 const { data } = embed
         
                 if (data && !data.error) {
                   message.channel.send({ embed: data })
                 } else {
                   message.reply('Could not find that documentation').then((m) => m.delete( { timeout: 5000} )).then(message.delete())
                 }
               })
               .catch((err) => {
                 console.error(err)
               })
           }

        }
}