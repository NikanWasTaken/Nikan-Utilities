const { Message, MessageEmbed } = require("discord.js");
const config = require("../../json/ignores.json").automod;
const client = require("../../index.js");
const automodModel = require("../../models/automod.js");
const ms = require("ms")

/**
 * @param {Message} message
 */

function isValidInvite(string) {
    var res = string.match(/(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?pp?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/);
    return (res !== null)
};

module.exports = {

    invites: async function invites(message) {

        if (isValidInvite(message?.content)) {

            if (
                message?.author.bot ||
                config.invites.permissions.some(perm => message?.member.permissions.has(perm)) ||
                message?.member.roles.cache.get(config["bypass-role"]) ||
                config.invites.channels.some(ch => message?.channel.name.includes(ch))
            ) return;

            message?.delete()
            message?.channel.send({
                content: `${message?.author}, you may not send discord invite links in the chat.`,
                allowedMentions: { parse: ["users"] }
            }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) });

            const automod = new automodModel({
                type: "Discord Invite",
                userId: message?.author.id,
                guildId: message?.guildId,
                reason: `Sending discord server invite links in the chat.`,
                date: Date.now(),
                expires: Date.now() + ms('2 days')
            })
            automod.save()

            let dm = new MessageEmbed()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setTitle(`You've been Warned in ${message?.guild.name}`)
                .addField("Punishment ID", `${automod._id}`, true)
                .addField("Expires", "in 2 days", true)
                .addField("Reason", "[Automod] Sending discord server invite links in the chat.", false)
                .setColor(`${client.color.modDm}`)
                .setTimestamp()
            message?.member.send({ embeds: [dm] })
                .catch(() => { return })

            client.log.automod({
                type: "Discord Invite",
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