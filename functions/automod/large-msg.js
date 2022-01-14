const { Message, MessageEmbed } = require("discord.js");
const config = require("../../json/ignores.json").automod;
const client = require("../../index.js");
const automodModel = require("../../models/automod.js");
const ms = require("ms")

/**
 * @param {Message} message
 */


module.exports = {

    largeMessage: async function largeMessage(message) {

        if (message?.content.length > 999) {
            if (
                message?.author.bot ||
                config["large-messages"].permissions.some(perm => message?.member.permissions.has(perm)) ||
                message?.member.roles.cache.get(config["bypass-role"]) ||
                message?.channel.name.includes(config["large-messages"].channels)
            ) return;


            message?.delete()
            message?.channel.send({
                content: `${message?.author}, you may not send very big messages in the chat!`,
                allowedMentions: { parse: ["users"] }
            }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) })

            const automod = new automodModel({
                type: "Large Messages",
                userId: message?.author.id,
                guildId: message?.guildId,
                reason: `Sending a huge amount of characters/large messages in the chat.`,
                date: Date.now(),
                expires: Date.now() + ms('2 days')
            })
            automod.save()

            let dm = new MessageEmbed()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setTitle(`You've been Warned in ${message?.guild.name}`)
                .addField("Punishment ID", `${automod._id}`, true)
                .addField("Expires", "in 2 days", true)
                .addField("Reason", "[Automod] Sending very large messages in the chat.", false)
                .setColor(`${client.color.modDm}`)
                .setTimestamp()
            message?.member.send({
                embeds: [dm]
            }).catch(() => { return })


            client.log.automod({
                type: "Large Message",
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