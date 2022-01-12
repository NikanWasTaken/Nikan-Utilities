const { MessageEmbed, MessageActionRow, MessageButton, version, Message, Client } = require('discord.js')
const { cpu, mem } = require('node-os-utils');
const os = require("os")
const { models, connection } = require("mongoose")

module.exports = {
    name: 'stats',
    category: 'Developers',
    description: `Returns the bot's stats including cpu usage, ram etc...`,
    cooldown: 3000,
    developer: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message) => {

        const { freeMemPercentage } = await mem.info()
        const values = Object.values(models);
        const totalEntries = await values.reduce(async (accumulator, model) => {
            const counts = await model.countDocuments();
            return (await accumulator) + counts;
        }, Promise.resolve(0));

        const infos = {
            ping: `• \`${Date.now() - message.createdTimestamp}ms\``,
            lastRestart: `<t:${~~(Date.now() / 1000 - client.uptime / 1000).toFixed(0)}:R>`,
            commandSize: `• \`${client.commands.size} commands\``,
            databaseState: `• \`${switchTo(connection.readyState)}\``,
            slashCommandSize: `• \`${client.slashCommands.size} commands\``,
            cpuUsage: `• \`${await cpu.usage()}%\``,
            memoryUsage: `• \`${100 - freeMemPercentage}%\``,
            nodeVersion: `• \`${process.version}\``,
            discordjsVersion: `• \`v${version}\``
        }
        const emojis = {
            ping: "<:ping:894097855759912970>",
            lastRestart: "🕐",
            memory: "<:memory:894097854484860939>",
            database: "<:database:915823830423982140>",
            cmd: "<:command:915820101947781141>",
            slashCmd: "<:slashcommands:897085046710763550>",
            cpu: "<:cpu:894097794405646346>",
            node: "<:node:894097855269208085>",
            discordjs: "<:discordjs:915821441843343381>"
        }



        const embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.username} `, iconURL: client.user.displayAvatarURL() })
            .setColor(`${client.color.botBlue} `)
            .addField(`${emojis.discordjs} Discord.js`, infos.discordjsVersion, true)
            .addField(`${emojis.lastRestart} Node.js`, infos.nodeVersion, true)
            .addField(`${emojis.lastRestart} Last Restart`, infos.lastRestart, true)
            .addField(`${emojis.database} Database`, infos.databaseState, true)
            .addField(`${emojis.cmd} Commands`, infos.commandSize, true)
            .addField(`${emojis.slashCmd} SlashCmd`, infos.slashCommandSize, true)
            .addField(`${emojis.ping} Latency`, infos.ping, true)
            .addField(`${emojis.cpu} Cpu`, infos.cpuUsage, true)
            .addField(`${emojis.memory} Memory`, infos.memoryUsage, true)
            .setTimestamp()

        const components = (state) => [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel("More Stats")
                    .setStyle("SECONDARY")
                    .setDisabled(state)
                    .setCustomId("stats"),
            )
        ]

        await message.channel.sendTyping()
        let msg = await message.reply({ embeds: [embed], components: components(false) })


        const collector = msg.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 30000,
            filter: (m) => m.customId === "stats"
        })

        collector.on("collect", async (collected) => {

            if (collected.user.id !== message.author.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })

            collected.reply({ content: "Please wait...", embeds: [], ephemeral: true })

            const embed = new MessageEmbed()
                .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .setColor(`${client.color.botBlue}`)
                .addField(
                    `${emojis.node} Operating System`,
                    [
                        `• **Host Name:** ${client.cap(os.hostname())}`,
                        `• **Platform:** ${client.cap(os.platform())}`,
                        `• **Type:** ${os.type()}`,
                        `• **Architecture:** ${os.arch()}`
                    ].join("\n")
                )
                .addField(
                    `${emojis.cpu} Cpu`,
                    [
                        `• **Model:** ${cpu.model()}`,
                        `• **Core Count:** ${cpu.count()}`,
                        `• **Usage:** ${~~(await cpu.usage())}%`,
                        `• **Free:** ${~~(await cpu.free())}%`
                    ].join("\n")
                )
                .addField(
                    `${emojis.database} Database`,
                    [
                        `• **Name:** [MongoDB](https://www.mongodb.com/)`,
                        `• **Status:** ${switchTo(connection.readyState)}`,
                        `• **Total Data:** ${totalEntries}`
                    ].join("\n")
                )
                .addField(
                    `${emojis.memory} Memory`,
                    [
                        `• **Total Memory:** ${client.convert.byte(`${mem.totalMem()}`)}`,
                        `• **Used Memory:** ${client.convert.byte(`${await mem.used()}`)} \`|\` ${100 - freeMemPercentage}%`,
                        `• **Free Memory:** ${client.convert.byte(`${mem.totalMem() - await mem.used()}`)} \`|\` ${freeMemPercentage}%`,
                    ].join("\n")
                )

            collected.editReply({ embeds: [embed], ephemeral: true, content: null })

        })

        collector.on("end", async () => {
            msg.edit({ components: [] })
        })

        // mongoose connection status
        function switchTo(val) {
            var status = " ";
            switch (val) {
                case 0: status = `Disconnected`
                    break;
                case 1: status = `Connected`
                    break;
                case 2: status = `Connecting`
                    break;
                case 3: status = `Disconnecting`
                    break;
            }
            return status;
        }
    }
}