const client = require("../index.js")
const config = require('../config.json')
const prefix = config.prefix
const Discord = require("discord.js")



client.on('message', async message =>{


    var autolog =  new Discord.WebhookClient('844408704703266837', 'p1ffreOqvZrTsbtOKbClTCiiip1p49U12W-KdcWgawKTja-FauOogOkrY0sWQDpVxgH6');
    let botcmdonly = `${message.author}, You can only use this command in <#800421771114709022>.`


 require("../automod/automod.js")(message, client, autolog)
 require("../automod/member-mistakes.js")(message)

});

