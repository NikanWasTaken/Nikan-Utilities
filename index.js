const { Client, Collection, WebhookClient } = require("discord.js");
const { Player } = require("discord-player");
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

// exporting other structures
require("./structures/client.js")(client); // client functions
require("./structures/send.js")(client); // this.send() functions


client.login(`${process.env.TOKEN}`);