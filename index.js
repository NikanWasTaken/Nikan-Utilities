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
    restTimeOffset: 300,
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
require("./functions/embeds.js")(client) // embeds
require("./functions/log.js")(client) // log embeds
require("./functions/delete.js")(client) // Delete functions 
require("./functions/convert.js")(client) // A function that converts timestamps to dates and times

client.login(`${process.env.TOKEN}`);