const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { mem, cpu, os } = require('node-os-utils');
const { models, connection } = require("mongoose")

module.exports = {
    name: "stats",
    category: 'Developers',
    description : `Returns stats about the bot!`,
    cooldown: 5000,


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {


        const values = Object.values(models);
        const totalEntries = await values.reduce(async (accumulator, model) => {
            const counts = await model.countDocuments();
            return (await accumulator) + counts;
        }, Promise.resolve(0));


            const embed = new MessageEmbed()
                .setTitle(`${client.user.username}'s stats`)
                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                .addField("__Client Statistics__", `**Discord.js:** ${require("../../package.json").dependencies['discord.js']}\n**Node Version:** ${process.version}\n**Latency:** ${Date.now() - interaction.createdTimestamp} ms\n**Uptime:** <t:${(Date.now() / 1000 - client.uptime / 1000).toFixed(0)}:T>`, true)
                .addField("__Database Statistics__", `**Status:** ${switchTo(connection.readyState)}\n**Total Memory:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} GB\n**Database entries:** ${totalEntries}`, true)
                .addField("** **", `** **`, true)
                .addField("__Operating System__", `**Name:** ${await os.oos()}\n**Platform:** ${os.platform()}\n**Type:** ${os.type()}\n**Architecture:** ${os.arch()}`, true)
                .addField("__CPU Statistics__", `**Model:** ${cpu.model()}\n**Core Count:** ${cpu.count()}\n**Usage:** ${await cpu.usage()} %`, true)
                .addField("** **", `** **`, true)
                .setColor("BLUE")

            interaction.followUp({ embeds: [embed]})




            function switchTo(val) {
                var status = " ";
                switch(val) {
                    case 0 : status = `Disconnected! <:redcircle:869807272992313345>`
                    break;
                    case 1 : status = `Connceted! <:greencircle:869807277731893258>`
                    break;
                    case 2 : status = `Connecting! <:yellowcircle:869807275785732127> `
                    break;
                    case 3 : status = `Disconnecting! <:yellowcircle:869807275785732127>`
                    break;
                }
                return status;
            }

    }
}