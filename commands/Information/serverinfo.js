const { MessageEmbed } = require('discord.js')
const moment = require("moment")

module.exports = {
    name: 'serverinfo',
    category: 'information',
    description: `Checks server's information.`,
    cooldown: 5000,
    botCommandOnly: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {



        try {

            const voiceChannel = message.guild.channels.cache.filter((ch) => ch.type === "GUILD_VOICE").size;
            const textChannel = message.guild.channels.cache.filter((ch) => ch.type === "GUILD_TEXT").size;
            const humans = message.guild.members.cache.filter((m) => !m.user.bot).size;
            const bots = message.guild.members.cache.filter((m) => m.user.bot).size;
            const humanbot = message.guild.memberCount;

            const embed = new MessageEmbed()
                .setAuthor(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
                .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
                .setColor("BLURPLE")
                .setTimestamp()
                .addField("General Information", `**Name** • ${message.guild.name}\n**Server ID** • ${message.guildId}\n**Owner** • ${(await message.guild.fetchOwner())}\n**Region** • Not available anymore!\n**Verification Level** • ${message.guild.verificationLevel.toString()}`, true)
                .addField("Counts", `Channels: ${message.guild.channels.cache.size} • #️⃣ ${textChannel} & 🔈 • ${voiceChannel}\nRoles • ${message.guild.roles.cache.size}\nMembers: ${humanbot} • Humans: ${humans} • Bots: ${bots}\nEmojis: ${message.guild.emojis.cache.size} `, false)
                .addField("Boosts Information", `Booster Role • ${await (message.guild.roles.premiumSubscriberRole)}\nBoosts Count • ${message.guild.premiumSubscriptionCount}\nBoost Level • ${message.guild.premiumTier.toString()}`, false)
                .addField("Creation Date", `${moment(message.guild.createdTimestamp).format("LT")} ${moment(
                    message.guild.createdTimestamp
                ).format("LL")} (${moment(message.guild.createdTimestamp).fromNow()})`)


            message.reply({ embeds: [embed] })
        } catch (e) {
            console.log(e)
        }



    }

}