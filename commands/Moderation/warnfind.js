const { MessageEmbed } = require("discord.js");
const warnModel = require("../../models/Punishments.js")
const moment = require("moment")


module.exports = {
    name: 'warnfind',
    category: 'moderation',
    description: `Shows information about the warn ID`,
    usage: '[warn-id]',
    aliases: ["warn-find", 'punishfind', 'findpunish', 'findwarn'],
    cooldown: 3000,
    permissions: ["MANAGE_MESSAGES"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, wrongUsage) => {

        const punishid = args[0]

        if (!punishid) return message.reply({ embeds: [wrongUsage] })

        const warnfind = await warnModel.findById(punishid)
        if (!warnfind) return message.reply("Invalid warn ID!")
        const type = warnfind.type
        const user = message.guild.members.cache.get(warnfind.userId) || "User has left!"
        const reason = warnfind.reason
        const moderator = message.guild.members.cache.get(warnfind.moderatorId) || "Moderator Has left!"
        const date = `${moment(warnfind.timestamp).format("LT")} ${moment(warnfind.timestamp).format("LL")}`

        const embed = new MessageEmbed()
            .setAuthor({ name: `Punishment Information`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setDescription(`Information for the punishment Id: \`${punishid}\``)
            .setColor("RANDOM")
            .addField("● Punishment Type", `${type}`, true)
            .addField("● Moderator", `> Moderator: ${moderator}\n> ID: ${warnfind.moderatorId}`, false)
            .addField("● Punished User", `> User: ${user}\n> ID: ${warnfind.userId}`, false)
            .addField("● Reason", `${reason}`, false)
            .addField("● Date & Time", `${date}`, false)

        message.reply({ embeds: [embed] })
    }
}