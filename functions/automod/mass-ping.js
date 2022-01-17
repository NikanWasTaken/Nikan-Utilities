const { Message, MessageEmbed } = require("discord.js");
const config = require("../../json/ignores.json").automod;
const client = require("../../index.js");
const automodModel = require("../../models/automod.js");
const ms = require("ms")

/**
 * @param {Message} message
 */

module.exports = {
    massMention: async function massMention(message) {

        if (message.mentions.users.size > 4) {

            if (
                message.author.bot ||
                config["mass-ping"].permissions.some(perm => message.member.permissions.has(perm)) ||
                message.member.roles.cache.get(config["bypass-role"]) ||
                config["mass-ping"].channels.some(ch => message?.channel.name.includes(ch))
            ) return;

            message.delete()
            message.channel.send({
                content: `${message.author}, you may not mention more then 4 users in the chat!`,
                allowedMentions: { parse: ["users"] }
            }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) })

            const automod = new automodModel({
                type: "Mass Mentioning",
                userId: message.author.id,
                guildId: message.guildId,
                reason: `Mentions more than 4 users in the chat!`,
                date: Date.now(),
                expires: Date.now() + ms('2 days')
            })
            automod.save()

            let dm = new MessageEmbed()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setTitle(`You've been Warned in ${message.guild.name}`)
                .addField("Punishment ID", `${automod._id}`, true)
                .addField("Expires", "in 2 days", true)
                .addField("Reason", "[Automod] Mentioning more than 4 users", false)
                .setColor(`${client.color.modDm}`)
                .setTimestamp()
            message.member.send({
                embeds: [dm]
            }).catch(() => { return });

            client.log.automod({
                type: "Mass Mention",
                color: "WARN",
                user: `${message.author.id}`,
                date: `${Date.now()}`,
                channel: `${message.channelId}`,
                id: `${automod._id}`,
                content: `${message.content}`
            })

        }

    }
}