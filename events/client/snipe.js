const client = require("../../index.js")


client.on('messageDelete', (message) => {

    if (message?.author?.bot) return;
    if (message.author?.id === client.config.owner) return;
    let snipes = client.snipes.get(message?.channel?.id) || [];
    if (snipes.length > 10) snipes = snipes.slice(0, 4);

    snipes.unshift({
        msg: message,
        image: message.attachments.first()?.proxyURL || null,
        time: Date.now(),
    })

    client.snipes.set(message.channel.id, snipes);
})