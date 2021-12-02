const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { mem, cpu, os } = require('node-os-utils');
const { models, connection } = require("mongoose")

module.exports = {
    name: "stats",
    category: 'Developers',
    description: `Returns stats about the bot!`,
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
            .setAuthor(`${client.user.username}`, client.user.displayAvatarURL())
            .setColor(`${client.embedColor.cool}`)
            .addField(`<:ping:894097855759912970> Ping`, `• \`${Date.now() - interaction.createdTimestamp}ms\``, true)
            .addField("🕐 Last Restart", `<t:${~~(Date.now() / 1000 - client.uptime / 1000).toFixed(0)}:R>`, true)
            .addField("<:memory:894097854484860939> Memory", `• \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\``, true)
            .addField("<:database:915823830423982140> Database", `• \`${switchTo(connection.readyState)}\``, true)
            .addField("<:command:915820101947781141> Commands", `• \`${client.commands.size} commands\``, true)
            .addField("<:slashcommands:897085046710763550> Commands", `• \`${client.slashCommands.size} commands\``, true)
            .addField("<:cpu:894097794405646346> CPU Usage", `• \`${await cpu.usage()}%\``, true)
            .addField("<:node:894097855269208085> Node", `• \`${process.version}\``, true)
            .addField("<:discordjs:915821441843343381> Discord.js", `• \`${(await require("../../package.json").dependencies['discord.js'].replace("^", "v"))}\``, true)
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

        let msg = await interaction.followUp({ embeds: [embed], components: components(false) })

        const collector = msg.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 30000,
            filter: (m) => m.customId === "stats"
        })

        collector.on("collect", async (collected) => {

            if (collected.user.id !== interaction.user.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })

            const embedmore = new MessageEmbed()
                .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                .setColor(`${client.embedColor.cool}`)
                .addField("<:cpu:894097794405646346> CPU Stats", `➜ Model • ${cpu.model()}\n➜ Cores • ${cpu.count()}\n➜ Usage • ${(await cpu.usage())}%`)
                .addField("<:database:915823830423982140> Database", `➜ Model • Mongoose\n➜ Status • ${switchTo(connection.readyState)}\n➜ Objects • ${totalEntries}`)
                .addField("<:node:894097855269208085> Operating", `➜ Host • Railway <:railway:915827823053262848>\n➜ Name • ${(await os.oos())}\n➜ Platform • ${os.platform()}\n➜ Type • ${os.type()}\n➜ Architecture • ${os.arch()}`)
                .setTimestamp()

            collected.reply({ embeds: [embedmore], ephemeral: true })


        })

        collector.on("end", async (i) => { msg.edit({ components: components(true) }) })


        // mongoose connection status

        function switchTo(val) {
            var status = " ";
            switch (val) {
                case 0: status = `Disconnected`
                    break;
                case 1: status = `Connceted`
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