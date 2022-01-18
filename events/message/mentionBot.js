const client = require("../../index.js")


client.on("messageCreate", async (message) => {

    const clientMentionEmbed = new MessageEmbed()
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(
            [
                `👋 Hey I'm ${client.user.username}.`,
                `My prefixes are \`${client.config.prefix}\` and <:NUslashcommands:897085046710763550> commands.`,
                `Type \`${client.config.prefix}help\` or \`/help\` in bot command channels to see my commands!`
            ].join("\n")
        )
        .setColor(`${client.color.invisible}`);

    if (
        message.content === `<@${client.user.id}>` ||
        message.content === `<@!${client.user.id}>` &&
        !message.author.bot
    ) return message.reply({ embeds: [clientMentionEmbed] }).then((msg) => {
        setTimeout(() => {
            msg?.delete()
            message?.delete()
        }, 20000)
    })

})