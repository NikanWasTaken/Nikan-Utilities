const { Client } = require("discord.js");
require("dotenv").config()

const client = new Client({
    presence: {
        status: "idle",
    },
    /**
        ws: {
            properties: {
                $browser: "Discord iOS"
            },
        },
        */
    intents: 32767,
    partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER'],
    allowedMentions: {
        repliedUser: false,
    }

});

module.exports = client;

// exporting the handler
require("./handler")(client);

// exporting other functions
require("./functions/client.js")(client); // client functions
require("./functions/send.js")(client); // this.send() functions
require("./functions/embeds.js")(client) // embeds
require("./functions/log.js")(client)

client.login(`${process.env.TOKEN}`);