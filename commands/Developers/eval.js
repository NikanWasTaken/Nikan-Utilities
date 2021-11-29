const { MessageEmbed } = require('discord.js')
const { inspect } = require("util")
require("dotenv").config()

module.exports = {
    name: 'eval',
    category: 'Developers',
    usage: '[code]',
    aliases: ["sudo"],
    developerOnly: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, missingpartembed) => {

        const code = args.join(' ');
        const anythingelseforu = "You are now demoted!"


        if(code?.includes(".destroy")) return message.channel.send({ content: anythingelseforu })
        if(code?.includes(".exit")) return message.channel.send({ content: anythingelseforu })
        if(code?.includes(".token")) return message.channel.send({ content: anythingelseforu })
        if(code?.includes(".env")) return message.channel.send({ content: anythingelseforu })
        if(code?.includes(".ban")) return message.channel.send({ content: anythingelseforu })
        if(code?.includes(".kick")) return message.channel.send({ content: anythingelseforu })
        if(code?.includes(".delete")) return message.channel.send({ content: anythingelseforu })



        function clean(text) {

            if (typeof text !== 'string') text = require('util').inspect(text, {
                depth: 0
            });

            text = text
                .replace(/(js)|()/g, '')
                .replace(/@/g, '@' + String.fromCharCode(8203))
                .replaceAll(client.token, anythingelseforu)
                .replaceAll(process.env.MONGOOSE, anythingelseforu)
            return text;
        }

        try {
            

            let evaled = eval(code);

            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            if (evaled.length >= 2000) evaled = evaled.slice(0, 2000);

            const cleaned = clean(evaled);

            if(evaled?.includes(process.env.TOKEN)) return message.channel.send({ content: anythingelseforu })
            if(evaled?.includes(process.env.MONGOOSE)) return message.channel.send({ content: anythingelseforu })


            if (cleaned !== 'Promise { <pending> }') {

                message.channel.send({
                    content: `\`\`\`js\n${cleaned}\`\`\``
                });

            } else {

                const embed = new MessageEmbed()
                    .setAuthor(`${client.user.username}`, client.user.displayAvatarURL())
                    .setTitle(`Evolution Succeded`).setURL(`${client.server.invite}`)
                    .setColor(`${client.embedColor.success}`)
                    .addField("Code", `\`\`\`js\n${code}\n\`\`\``)
                    .setTimestamp()

                    message.channel.send({ embeds: [embed] })
            }

        } catch (err) {

            const embed = new MessageEmbed()
                .setAuthor(`${client.user.username}`, client.user.displayAvatarURL())
                .setTitle(`Error While Evoluting`).setURL(`${client.server.invite}`)
                .setColor(`${client.embedColor.failed}`)
                .addField("Code", `\`\`\`js\n${code}\n\`\`\``)
                .addField("Error Message", `\`\`\`xl\n${err.message}\n\`\`\``)
                .setTimestamp()


            message.channel.send({
                embeds: [embed]
            });

        }
    }
}