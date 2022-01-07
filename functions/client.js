const { Collection } = require("discord.js")
/**
 * @param {Client} client
 */
module.exports = async (client) => {

    // colors
    client.color = {
        success: "#65b385",
        failed: "#de564c",
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
        appeal: "https://forms.gle/dW8RGLA65ycC4vcM7"
    }

    // Capatilize first latter
    client.cap = function capatilize(string) {
        if (!string) throw new Error("You need to provide a string for capatilize function to work!");
        return `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`
    }


    // other functions 

    client.commands = new Collection();
    client.slashCommands = new Collection();
    client.snipes = new Collection();
    client.afk = new Collection()
    client.config = require("../config.json");
    client.warncooldown = new Collection();


}