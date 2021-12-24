let { MessageEmbed, WebhookClient } = require("discord.js")
let client = require("../../index.js")

const errorHandlerChannel = new WebhookClient({
    token: "Pc5j3AjcSEK3bed4QrxytOgFLwhbZiIiQYL8oezsVCDEF5_K1CA6-wzzJV4JoMMu1lvY",
    id: "923873525616484392"
})

process.on("unhandledRejection", (reason, promise) => {

    const embed = new MessageEmbed()
        .setTitle(`Unhandled Rejection`)
        .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
        .addField("Error", `\`\`\`${reason.stack.length >= 1024 ? `The full error is too long to show.\n\n${reason}` : reason.stack}\`\`\``)
        .addField("Promise", `\`\`\`${promise}\`\`\``)
        .setTimestamp()
        .setFooter(`${client.user.username} Error Handling`, client.user.displayAvatarURL({ dynamic: true }))
        .setColor(`${client.color.invisible}`)

    console.log(reason)
    return errorHandlerChannel.send({ embeds: [embed] })


});


process.on("uncaughtException", (err, origin) => {

    const embed = new MessageEmbed()
        .setTitle(`Uncaught Exception`)
        .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
        .addField("Error", `\`\`\`${err.stack.length >= 1024 ? `The full error is too long to show.\n\n${err}` : err.stack}\`\`\``)
        .addField("Origin", `\`\`\`${origin}\`\`\``)
        .setTimestamp()
        .setFooter(`${client.user.username} Error Handling`, client.user.displayAvatarURL({ dynamic: true }))
        .setColor(`${client.color.invisible}`)

    return errorHandlerChannel.send({ embeds: [embed] })

});


process.on("uncaughtExceptionMonitor", (err, origin) => {

    const embed = new MessageEmbed()
        .setTitle(`Uncaught Exception Monitor`)
        .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
        .addField("Error", `\`\`\`${err.stack.length >= 1024 ? `The full error is too long to show.\n\n${err}` : err.stack}\`\`\``)
        .addField("Origin", `\`\`\`${origin}\`\`\``)
        .setTimestamp()
        .setFooter(`${client.user.username} Error Handling`, client.user.displayAvatarURL({ dynamic: true }))
        .setColor(`${client.color.invisible}`)

    return errorHandlerChannel.send({ embeds: [embed] })

});
