const client = require("../index.js")
const config = require('../config.json')
const prefix = config.prefix



client.on('messageDelete', (message) => {

    if(message.author.bot) return;
    let snipes = client.snipes.get(message.channel.id ) || [];
    if(snipes.length > 10) snipes = snipes.slice(0, 4)
 
    snipes.unshift({
        msg: message,
        image: message.attachments.first()?.proxyURL || null, 
        time: Date.now(),
    })

    client.snipes.set(message.channel.id, snipes);
})