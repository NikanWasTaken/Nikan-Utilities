const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'bans',
    category : 'moderation',
    description : 'Shows all the banned members in the server',
    aliases: ["all-bans", "allbans", "banned-mambers"],
    cooldown: 10000,
    botCommandOnly: true,
    userPermissions: ["BAN_MEMBERS"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        try {
        
                
        var amount = 1;
        const fetchBans = message.guild.bans.fetch()
        const bannedMembers = (await fetchBans)
        .map((member) => `> ${amount++}. **${member.user.tag}** | \`${member.user.id}\``)
        .join("\n");
        const bansEmbed = new MessageEmbed()
        .setAuthor(`Banned Members in ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`${bannedMembers}`)
        .setFooter(`Amount: ${amount - 1}`)
        .setTimestamp()
        .setThumbnail(message.guild.iconURL({ dynamic: true}))
        .setColor("RED")
    
    
        message.reply({ embeds: [bansEmbed]})

    } catch (error) {
            message.reply("Something went wrong!") 
    }


    }
}