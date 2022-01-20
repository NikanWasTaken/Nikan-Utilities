const { Collection } = require("discord.js")
/**
 * @param {Client} client
 */
module.exports = async (client) => {

    // colors
    client.color = {
        success: "#65b385",
        fail: "#de564c",
        loading: "#d5a538",
        invisible: "#2F3136",
        moderationRed: "#b3666c",
        moderation: "#dbca95", // last = #e6cc93 , halloween = #f29455
        modDm: "#f5d765",
        botBlue: "#3d81f5",
        serverPurple: "#905de3",
    }

    // emoijs
    client.emoji = {
        success: "<:success:920918055813533746>",
        load: "<a:NUloading:894087871626084352>",
        fail: "<:failed:920917857670422599>",
    }

    // Nikan's World
    client.server = {
        id: '757268973674037315',
        invite: `https://discord.gg/4HX9RneUjt`,
        mutedRole: "795353284042293319",
        appeal: "https://forms.gle/dW8RGLA65ycC4vcM7",
        verificationChannel: '912572618308210708',
        generalChannel: '782837655082631229'
    }

    // Capatilize first latter
    client.cap = function (str) {
        str = str.replace(/\_/g, ' ');
        const split = str.trim().split(" ")
        const splitFixed = [];
        split.forEach((e) => {
            e = e.charAt(0).toUpperCase() + e.slice(1).toLocaleLowerCase();
            splitFixed.push(e);
        });
        return splitFixed.join(' ');
    };


    // other functions 
    client.commands = new Collection();
    client.slashCommands = new Collection();
    client.snipes = new Collection();
    client.afk = new Collection()
    client.config = require("../json/config.json");
    client.warncooldown = new Collection();


}