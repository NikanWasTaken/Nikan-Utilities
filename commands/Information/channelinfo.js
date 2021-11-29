const { Message, Client, MessageEmbed } = require("discord.js")
const moment = require("moment")

module.exports = {
    name : 'channelinfo',
    category : 'information',
    botCommandOnly: true,
    description : `Shows information about a channel`,
    aliases: ["channel-info"],
    cooldown: 5000,
    usage: `<channel>`,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {
        

        let channel = message.mentions.channels.first() || client.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.channel;

        let types = []
        if(channel.type === "GUILD_TEXT")  types.push("Text channel")
        if(channel.type === "GUILD_VOICE") types.push("Voice channel")
        if(channel.type === "GUILD_CATEGORY") types.push("Category")
        if(channel.type === "GUILD_NEWS") types.push("Announcement channel")
        if(channel.type === "GUILD_STAGE_VOICE") types.push("Stage channel")

        let channelembed = new MessageEmbed()
            .setAuthor(`Information for ${channel.name}`, message.guild.iconURL({ dynamic: true }))
            .addField("Name", `${channel}`, true)
            .addField("ID", channel.id, true)
            .addField("Description", `${channel.topic || "No Description"}`)
            .addField("Additional Information", `> Nsfw: ${channel.nsfw ? "✅" : "❌"}\n> Type: ${types.join(", ")}`, false)
            .addField("Created At", `${moment(channel.createdTimestamp).format("LT")} ${moment(channel.createdTimestamp).format("LL")} (${moment(channel.createdTimestamp).fromNow()})`, false)
            .setColor("RANDOM")
        message.reply({ embeds: [channelembed]})


    }
}
        

    
