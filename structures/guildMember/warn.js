const client = require("../../index")
const { GuildMember, MessageEmbed } = require("discord.js")
const punishmentModel = require("../../models/Punishments.js")
const ms = require("ms")

GuildMember.prototype.warn = async function (options) {
    // defining some values
    let msg = options?.msg;
    let reason = options?.reason;

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
    function msgSendType(message, content) {
        if (
            message?.followUp === undefined ||
            message?.followUp === null
        ) {
            if (message?.reply) {
                return message.reply(content)
            }
        } else if (message?.followUp) {
            return message.followUp(content)
        }
    }

    // Checking if the user in on a warning protection
    if (client.util.cooldown.warn.has(`${this.user.id}`)) {

        const embed = new MessageEmbed()
            .setDescription("Whoops, looks like there is a double warning here!")
            .setColor("RED")
        const content = { embeds: [embed] }
        return msgSendType(msg, content).then((msg) => {
            setInterval(() => {
                msgDeleteType(msg)
            }, 5000);
        })
    }

    // Saving the punishment data
    const punishmentData = new punishmentModel({
        type: "Warn",
        userId: this.user.id,
        guildId: msg.guildId,
        moderatorId: msgAuthorType(msg)?.id,
        reason: reason,
        timestamp: Date.now(),
        expires: Date.now() + ms('4 weeks'),
        systemExpire: Date.now() + ms("4 weeks")
    })
    punishmentData.save();

    // Saving the warn protection
    client.util.cooldown.warn.set(
        this.user.id,
    );
    setTimeout(() => {
        client.util.cooldown.warn.delete(`${this.user.id}`);
    }, 10000);

    // sending the warn message
    let warnEmbed = new MessageEmbed()
        .setDescription(`${this.user} has been **warned** | \`${punishmentData._id}\``)
        .setColor(`${client.color.moderation}`)

    let sentMsg = await msg.channel.send({ embeds: [warnEmbed] })
        .then(msgDeleteType(msg))

    // Sending the DM
    let dmEmbed = new MessageEmbed()
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
        .setTitle(`You've been Warned in ${msg.guild.name}`)
        .addField("Punishment ID", `${punishmentData._id}`, true)
        .addField("Expires In", `4 weeks`, true)
        .addField("Reason", reason, false)
        .setColor(`${client.color.modDm}`)
        .setTimestamp()
    this.send({ embeds: [dmEmbed] })
        .catch(() => { })


    // Sending the punishment to logs
    client.log.action({
        type: "Warn",
        color: "WARN",
        user: this.user.id,
        moderator: msgAuthorType(msg)?.id,
        reason: reason,
        id: `${punishmentData._id}`,
        url: `https://discord.com/channels/${sentMsg.guildId}/${sentMsg.channelId}/${sentMsg.id}`
    })
}