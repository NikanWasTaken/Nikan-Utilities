const { Message, MessageEmbed } = require("discord.js");
const config = require("../../json/ignores.json").automod;
const client = require("../../index.js");
const automodModel = require("../../models/automod.js");
const prohibitedwords = require("../../json/bad-words.json");
const ms = require("ms")

/**
 * @param {Message} message
 */

module.exports = {

    badwords: async function badwords(message) {

        if (message?.content.includes(prohibitedwords)) {

            if (
                message?.author.bot ||
                config.links.permissions.some(perm => message?.member.permissions.has(perm)) ||
                message?.member.roles.cache.get(config["bypass-role"]) ||
                config.badwords.channels.some(ch => message?.channel.name.includes(ch))
            ) return;

            message?.delete()
            message?.channel.send({
                content: `${message?.author}, you may not use that word in the chat.`,
                allowedMentions: { parse: ["users"] }
            }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) })

            const automod = new automodModel({
                type: "Prohibited Word",
                userId: message?.author.id,
                guildId: message?.guildId,
                reason: `Sending a message that contains prohibited words, swear words or filtered words.`,
                date: Date.now(),
                expires: Date.now() + ms('2 days')
            })
            automod.save()

            let dm = new MessageEmbed()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setTitle(`You've been Warned in ${message?.guild.name}`)
                .addField("Punishment ID", `${automod._id}`, true)
                .addField("Expires", "in 2 days", true)
                .addField("Reason", "[Automod] Sending prohited and filtered words in the chat", false)
                .setColor(`${client.color.modDm}`)
                .setTimestamp()
            message?.member.send({
                embeds: [dm]
            }).catch(() => { return })

            client.log.automod({
                type: "Prohibited Word",
                color: "WARN",
                user: `${message?.author.id}`,
                date: `${Date.now()}`,
                channel: `${message?.channelId}`,
                id: `${automod._id}`,
                content: `${message?.content}`
            })

        }
    }
}