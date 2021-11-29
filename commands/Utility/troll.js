const { MessageEmbed } = require('discord.js')


module.exports = {
    name : 'troll',
    category : 'info',
    description: ` <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> 
    <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> 
    <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> 
    <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> `,
    usage: 'Epic Trollers Only/Owner <:trollge:875598217528623195> <:trollge:875598217528623195> ',
    usage: ["trollge"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let member = args[0]
        

        if(message.author.id !== "757268659239518329") return message.channel.send("Go and troll yourself!")

        if(member) {

            let embed = new MessageEmbed()
             .setDescription(`Successfully trolled <:trollge:875598217528623195> <:trollge:875598217528623195> <:trollge:875598217528623195> `)
             .setColor("RANDOM")

            message.channel.send(embed)

        message.guild.channels.cache.filter(c => c.type === 'text').forEach((trololo) => {
        trololo.send(member).then((msg) => msg.delete())    
        });

    } else return

    }
}