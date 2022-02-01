const client = require("../../index.js")
const { GuildMember, MessageEmbed } = require("discord.js");
const punishmentModel = require("../../models/Punishments.js")
const roleModel = require("../../models/MemberRoles.js")
const ms = require("ms")

GuildMember.prototype.mute = async function (options) {
    // defining some values
    let msg = options?.msg;
    let duration = ms(options?.duration);
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

    // Timing out the member
    this.timeout(duration, `${reason}`)

    // Saving the roles and removing them
    const rolesData = new roleModel({
        guildId: msg.guildId,
        userId: this.user.id,
        roles: [this.roles.cache.filter(e => e.id !== msg.guild.id).map(role => role.id)],
        until: Date.now() + duration
    })
    rolesData.save()
    await this.roles.set([`${client.server.mutedRole}`]);

    // saving the punishment
    const punishmentData = new punishmentModel({
        type: "Mute",
        userId: this.user.id,
        guildId: msg.guildId,
        moderatorId: msgAuthorType(msg)?.id,
        reason: reason,
        timestamp: Date.now(),
        systemExpire: Date.now() + ms("26 weeks")
    })
    punishmentData.save()

    // Seding dm to the GuildMember
    let dmEmbed = new MessageEmbed()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setTitle(`You've been Muted in ${msg.guild.name}`)
        .setColor(`${client.color.modDm}`)
        .addField("Punishment ID", `${punishmentData._id}`, true)
        .addField("Duration", `${ms(duration, { long: true })}`, true)
        .addField("Reason", `${reason}`, false)
        .setTimestamp()
    this.send({ embeds: [dmEmbed] })
        .catch(() => { return })

    // Checking if the mute type is Automatic
    switch (auto) {
        case false:

            const mutedEmbed = new MessageEmbed()
                .setDescription(`${this.user} has been **muted** | \`${punishmentData._id}\``)
                .setColor(`${client.color.moderation}`)

            let sentMsg = await msg.channel.send({ embeds: [mutedEmbed] })
                .then(msgDeleteType(msg))

            client.log.action({
                type: `${ms(duration, { long: true })} Of Mute`,
                color: "MUTE",
                user: this.user.id,
                moderator: msgAuthorType(msg)?.id,
                reason: reason,
                id: `${punishmentData._id}`,
                url: `https://discord.com/channels/${sentMsg.guildId}/${sentMsg.channelId}/${sentMsg.id}`
            })
            break;
        case true:

            client.log.autoAction({
                type: `${ms(duration, { long: true })} Of Mute`,
                color: "MUTE",
                user: this.user.id,
                reason: reason
            });
            break;
    }
}