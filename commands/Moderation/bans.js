const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'bans',
    category : 'moderation',
    description : 'See all the ban members in the server.',
    aliases: ["all-bans", "allbans", "banned-mambers"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")

        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(noperm).then((msg) => msg.delete( {timeout: 5000})).then(messages.delete())
        var amount = 1;
        const fetchBans = message.guild.fetchBans();
        const bannedMembers = (await fetchBans)
        .map((member) => `> __${amount++}.__ **${member.user.tag}** | (*${member.user.id}*)`)
        .join("\n");
        const bansEmbed = new MessageEmbed()
        .setAuthor(`Bans for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`${bannedMembers}`)
        .setFooter(`Amount: ${amount - 1}`)
        .setTimestamp()
        .setColor("RED")


        message.channel.send("Fetching the server's bans...").then((msg) => msg.edit(bansEmbed))

    }
}