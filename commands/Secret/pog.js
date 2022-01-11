const { Message } = require("discord.js");

module.exports = {
    name: "pog",
    category: "Secret",
    description: "poggr",
    cooldown: 2000,
    permissions: ["MANAGE_MESSAGES"],
    visible: false,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, wrongUsage) => {
        const array = [
            "champy",
            "champ",
            "pogger",
            "poggr",
            "<a:poggr:915939849859653663>",
            "pogchampy",
        ];

        const boop = array[~~(Math.random() * array.length)];
        message.channel.send({ content: boop });
    },
};
