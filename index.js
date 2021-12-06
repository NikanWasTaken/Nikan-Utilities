const { Client, Collection, WebhookClient } = require("discord.js");
const { Player } = require("discord-player");
require("dotenv").config()

const client = new Client({
    presence: {
        status: "idle",
    },

    // ws: {
    //     properties: {
    //         $browser: "Discord iOS" 
    //     },
    // },

    intents: 32767,
    partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER'],
    allowedMentions: {
        repliedUser: false,
    }

});

module.exports = client;

//  // music player client

// const player = new Player(client, {
//     leaveOnEnd: false,
//     leaveOnStop: false,
//     leaveOnEmpty: false,
//     leaveOnEmptyCooldown: 60000,
//     autoSelfDeaf: true,
//     initialVolume: 100,
//     bufferingTimeout: 3000,
//   });


client.botEmoji = {
    success: "<a:NUsuccess:872203367047397426>",
    loading: "<a:NUloading:894087871626084352>",
    failed: "<a:NUfailed:872203367718457424>",
    bot: "<:NUbot:875668173419073546>",
}

client.embedColor = {
    success: "#65b385",
    failed: "#de564c",
    loading: "#d5a538",
    noColor: "#2F3136",
    moderationRed: "#b3666c",
    moderation: "#dbca95", // last = #e6cc93 , halloween = #f29455
    logGreen: "#85ef93",
    logYellow: "#fae673",
    logAqua: "#87a7ec",
    logRed: "#db504c",
    modDm: "#f5d765",
    botBlue: "#3d81f5",
    cool: "#905de3",
    logs: "#f5d765"
}

client.server = {
    id: '757268973674037315',
    invite: `https://discord.gg/4HX9RneUjt`,
}

client.webhook = {
    moderation: new WebhookClient({ id: `910100385501433887`, token: `WDxlbcSouTKN5dKX65UaNvajh64Wb2OsXiKtDdmZgyS6Y9VtO22kD3E6YxrpgYMkVi5y` }),
    automod: new WebhookClient({ id: `910104675716571136`, token: `mJQ3F73THOBgvp4E5QHQhJfL28k581qM1IDW88ctLyGLgozKF9U26ygQ_ahwIq4tHwpG` }),
    autoaction: new WebhookClient({ id: `917408937756741662`, token: `92dznvZixjZrgHLBYgERwS1ngRWcDSdldvhaaNlPpjHYyBDuwl6TbNyU4InU9nqTJIw8` }),
}


// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.snipes = new Collection();
client.afk = new Collection()
client.config = require("./config.json");
client.warncooldown = new Collection();
// client.player = player;

// Initializing the project
require("./handler")(client);

client.login(`${process.env.TOKEN}`);