const { User, MessageEmbed } = require("discord.js")
const client = require("../../index")
const punishmentModel = require("../../models/Punishments.js")
const ms = require("ms")

User.prototype.Ban = async function (options) {
    // defining some values
    let msg = options?.msg;
    let reason = options?.reason;
    let auto = options?.auto ? options?.auto : false;

    // functions
    function msgDeleteType(message) {
        if (
            message?.deleteReply === undefined ||
            message?.deleteReply === null
        ) {
            if (message?.delete) {
                return message.delete()
            }
        } else if (message?.deleteReply) {
            return message.deleteReply()
        }
    }
    function msgAuthorType(message) {
        if (
            message?.user === undefined ||
            message?.user === null
        ) {
            if (message?.author) {
                return message.author
            }
        } else if (message?.user) {
            return message.user
        }
    }

    const user = await msg.guild.members.ban(this.id, { reason: reason })
    // saving the punishment
    const punishmentData = new punishmentModel({
        type: "Ban",
        userId: user?.id,
        guildId: msg.guildId,
        moderatorId: msgAuthorType(msg)?.id,
        reason: reason,
        timestamp: Date.now(),
        systemExpire: Date.now() + ms("26 weeks")
    })
    punishmentData.save()

    // Checking if the mute type is Automatic
    switch (auto) {
        case false:

            const bannedEmbed = new MessageEmbed()
                .setDescription(`**${user?.tag}** has been **banned** | \`${punishmentData._id}\``)
                .setColor(`${client.color.moderationRed}`)

            let sentMsg = await msg.channel.send({ embeds: [bannedEmbed] })
                .then(msgDeleteType(msg))

            client.log.action({
                type: `Ban`,
                color: "BAN",
                user: user?.id,
                moderator: msgAuthorType(msg)?.id,
                reason: reason,
                id: `${punishmentData._id}`,
                url: `https://discord.com/channels/${sentMsg.guildId}/${sentMsg.channelId}/${sentMsg.id}`
            })
            break;
        case true:

            client.log.autoAction({
                type: `Ban`,
                color: "BAN",
                user: user?.id,
                reason: reason
            });
            break;

    }
}