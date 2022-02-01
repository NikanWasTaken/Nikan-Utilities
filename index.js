const { Client } = require("discord.js");
require("dotenv").config()

const client = new Client({
    presence: {
        status: "dnd",
    },
    intents: 32767,
    restTimeOffset: 300,
    partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER'],
    allowedMentions: {
        repliedUser: false,
    }
});
client.setMaxListeners(15)

module.exports = client;

// exporting the handler
require("./handler")(client);

// exporting other functions
require("./functions/client.js")(client);
require("./functions/embeds.js")(client)
require("./functions/log.js")(client)
require("./functions/convert.js")(client)


client.login(`${process.env.TOKEN}`);