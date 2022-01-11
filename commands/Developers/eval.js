const { MessageEmbed, Message, Client, MessageActionRow, MessageButton } = require('discord.js')
require("dotenv").config()

module.exports = {
    name: 'eval',
    category: 'Developers',
    usage: '[code]',
    developer: true,
    visible: false,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, wrongUsage) => {

        const code = args.join(' ');
        if (!code) return message.reply({ embeds: [wrongUsage] });

        let danger = false;
        if (
            code?.includes(".destroy") ||
            code?.includes(".exit") ||
            code?.includes(".token") ||
            code?.includes(".env")
        ) danger = true;

        function clean(text) {

            if (typeof text !== 'string') text = require('util').inspect(text, {
                depth: 0
            });
            text = text
                .replace(/(js)|()/g, '')
                .replace(/@/g, '@' + String.fromCharCode(8203))
            return text;
        }

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Yes")
                .setStyle("SUCCESS")
                .setCustomId("eval-yes"),

            new MessageButton()
                .setLabel("No")
                .setStyle("DANGER")
                .setCustomId("eval-no")
        )

        try {

            if (danger === false) {

                let evaled = eval(code);

                if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                if (evaled.length >= 2000) evaled = evaled.slice(0, 2000);
                const cleaned = clean(evaled);

                if (cleaned === 'Promise { <pending> }') {

                    const embed = new MessageEmbed()
                        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`Evolution Succeded`).setURL(`${client.server.invite}`)
                        .setColor(`${client.color.success}`)
                        .addField("Code", `\`\`\`js\n${code}\n\`\`\``)
                        .setTimestamp()
                    return message.channel.send({
                        embeds: [embed]
                    })

                } else {

                    message.channel.send({
                        content: `\`\`\`js\n${cleaned}\`\`\``
                    });

                }

            } else if (danger === true) {

                const embedDanger = new MessageEmbed()
                    .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setColor("RED")
                    .addField("Are you sure?", "Are you sure that you want to do this evolution? This action has triggered the bot's secrets reveal system")
                    .setFooter({ text: "Choose your action using the buttons!" })

                let msg = await message.reply({
                    embeds: [embedDanger],
                    components: [row]
                })

                const collector = msg.createMessageComponentCollector({
                    componentType: "BUTTON",
                    time: "20000",
                })

                collector.on("collect", async (collected) => {

                    if (collected.customId === "eval-yes") {

                        let evaled = eval(code);

                        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                        if (evaled.length >= 2000) evaled = evaled.slice(0, 2000);
                        const cleaned = clean(evaled);

                        if (cleaned === 'Promise { <pending> }') {

                            const embed = new MessageEmbed()
                                .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                                .setTitle(`Evolution Succeded`).setURL(`${client.server.invite}`)
                                .setColor(`${client.color.success}`)
                                .addField("Code", `\`\`\`js\n${code}\n\`\`\``)
                                .setTimestamp()

                            return msg.edit({
                                embeds: [embed],
                                components: []
                            })

                        } else {

                            msg.delete()
                            message.channel.send({
                                content: `\`\`\`js\n${cleaned}\`\`\``
                            });

                        }

                    } else if (collected.customId === "eval-no") {

                        msg.edit({
                            embeds: [],
                            content: "Canceled.",
                            components: []
                        })

                    }
                })
            }

        } catch (err) {

            const embed = new MessageEmbed()
                .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .setTitle(`Error While Evoluting`).setURL(`${client.server.invite}`)
                .setColor(`${client.color.fail}`)
                .addField("Code", `\`\`\`js\n${code}\n\`\`\``)
                .addField("Error Message", `\`\`\`xl\n${err.message}\n\`\`\``)
                .setTimestamp()

            message.channel.send({
                embeds: [embed]
            });
        }
    }
}
