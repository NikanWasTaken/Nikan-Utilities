const { Message, MessageEmbed } = require("discord.js");
const config = require("../../json/ignores.json").automod;
const client = require("../../index.js");
const automodModel = require("../../models/automod.js");
const ms = require("ms")

/**
 * @param {Message} message
 */


function isValidURL(string) {
    var res = string.match(/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi)
    return (res !== null)
};

module.exports = {

    links: async function links(message) {

        if (isValidURL(message.content)) {

            if (
                message.author.bot ||
                config.links.permissions.some(perm => message.member.permissions.has(perm)) ||
                message.member.roles.cache.get(config["bypass-role"]) ||
                config.links.channels.some(ch => message?.channel.name.includes(ch))
            ) return;

            message.delete()
            message.channel.send({
                content: `${message.author}, you may not send links in the chat!`,
                allowedMentions: { parse: ["users"] }
            }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) });

            const automod = new automodModel({
                type: "Links",
                userId: message.author.id,
                guildId: message.guildId,
                reason: `Sending website or other links in the chat.`,
                date: Date.now(),
                expires: Date.now() + ms('2 days')
            })
            automod.save()

            let dm = new MessageEmbed()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setTitle(`You've been Warned in ${message.guild.name}`)
                .addField("Punishment ID", `${automod._id}`, true)
                .addField("Expires", "in 2 days", true)
                .addField("Reason", "[Automod] Sending links!", false)
                .setColor(`${client.color.modDm}`)
                .setTimestamp()
            message.member.send({
                embeds: [dm]
            }).catch(() => { return });

            client.log.automod({
                type: "Links",
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