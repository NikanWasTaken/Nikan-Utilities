const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'newtest',
    category : 'Bot Developer',
    usage:'Owner',
    aliases:['new-test', 'new-command', 'new-code', 'newcode', 'newcommmand', 'newnode', 'new-node'],


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {


        if(message.member.roles.cache.get("813983796361428993") || message.member.roles.cache.get("800976899337355294")) {
        if(message.channel.id !== "814777367498981378") return message.channel.send("Not in this channel sir!")
        message.channel.send('**\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n**')
        message.channel.send("This channel is ready for the new code/command tests.")
        } return
        
    }
}