let { MessageEmbed } = require("discord.js")
let client = require("../../index.js")



process.on("unhandledRejection", (reason, promise) => {

    const channel = client.channels.cache.get("901478033628753951")

    const embed = new MessageEmbed()
        .setTitle(`Unhandled Rejection`)
        .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
        .addField("Error", `\`\`\`${reason.stack.lengh >= 1024 ? `The full error is too long to show.\n\n${reason}` : reason.stack}\`\`\``)
        .addField("Promise", `\`\`\`${promise}\`\`\``)
        .setTimestamp()
        .setFooter(`${client.user.username} Error Handling`, client.user.displayAvatarURL({ dynamic: true }))
        .setColor(`${client.embedColor.noColor}`)

    console.log(reason)
    return channel.send({ embeds: [embed] })


});


process.on("uncaughtException", (err, origin) => {

    const channel = client.channels.cache.get("901478033628753951")

    const embed = new MessageEmbed()
        .setTitle(`Uncaught Exception`)
        .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
        .addField("Error", `\`\`\`${err.stack.lengh >= 1024 ? `The full error is too long to show.\n\n${err}` : err.stack}\`\`\``)
        .addField("Origin", `\`\`\`${origin}\`\`\``)
        .setTimestamp()
        .setFooter(`${client.user.username} Error Handling`, client.user.displayAvatarURL({ dynamic: true }))
        .setColor(`${client.embedColor.noColor}`)

    return channel.send({ embeds: [embed] })

});


process.on("uncaughtExceptionMonitor", (err, origin) => {

    const channel = client.channels.cache.get("901478033628753951")

    const embed = new MessageEmbed()
        .setTitle(`Uncaught Exception Monitor`)
        .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
        .addField("Error", `\`\`\`${err.stack.lengh >= 1024 ? `The full error is too long to show.\n\n${err}` : err.stack}\`\`\``)
        .addField("Origin", `\`\`\`${origin}\`\`\``)
        .setTimestamp()
        .setFooter(`${client.user.username} Error Handling`, client.user.displayAvatarURL({ dynamic: true }))
        .setColor(`${client.embedColor.noColor}`)

    return channel.send({ embeds: [embed] })

});
