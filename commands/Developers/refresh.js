const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'refresh',
    category : 'Developers',
    developerOnly: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {
        

            let start = new MessageEmbed().setDescription(`${client.botEmoji.loading} Started Refreshing...`).setColor(`${client.embedColor.failed}`)
            let finished = new MessageEmbed().setDescription(`${client.botEmoji.success} Refresh Completed!`).setColor(`${client.embedColor.success}`)

            message.reply({ embeds: [start] }) 
            .then((msg) => msg.edit({ embeds: [finished]}))
            .then(() => client.destroy())
            .then(() => client.login(process.env.TOKEN))

    
              
    }
}