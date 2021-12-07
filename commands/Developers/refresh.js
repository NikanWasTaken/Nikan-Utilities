const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
require("dotenv").config()
const glob = require("glob");

module.exports = {
    name: 'refresh',
    category: 'Developers',
    developerOnly: true,
    aliases: ["reload", "reloadall"],
    cooldown: 10000,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {


        const components = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Client")
                .setStyle("SECONDARY")
                .setEmoji("<:node:894097855269208085>")
                .setCustomId("refresh"),

            new MessageButton()
                .setLabel("Commands")
                .setStyle("SECONDARY")
                .setEmoji("<:command:915820101947781141>")
                .setCustomId("reload"),

        )

        const embed = new MessageEmbed()
            .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
            .setColor(`${client.color.cool}`)
            .addField("Refresh Client", `If you want to refresh the bot's client`)
            .addField("Refresh Commands", `If you want to refresh commands and slash commands.`)
            .setTimestamp()

        let msg = await message.channel.send({ embeds: [embed], components: [components] })
        message.delete()


        const collector = msg.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 10000,
        })

        collector.on("collect", async (collected) => {

            if (collected.customId === "refresh") {

                if (collected.user.id !== message.author.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })

                collector.stop()
                const refresh = new MessageEmbed()
                    .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                    .setColor(`${client.color.loading}`)
                    .addField(`Refreshing`, `${client.botEmoji.loading} Refreshing the client...`)

                let msg = await message.channel.send({ embeds: [refresh] })
                await client.destroy()
                await client.login(`${process.env.TOKEN}`)
                await msg.edit({ embeds: [refresh.addField("Refreshed", `${client.botEmoji.success} The client has been refreshed!`).setColor(`${client.color.success}`).setTimestamp()] }).then((msgg) => {
                    setTimeout(() => {
                        msgg.delete()
                    }, 2000)
                })


            } else if (collected.customId === "reload") {

                if (collected.user.id !== message.author.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })

                collector.stop()

                const reload = new MessageEmbed()
                    .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                    .setColor(`${client.color.loading}`)

                let msg = await message.channel.send({ embeds: [reload] })

                client.commands.sweep(() => true)

                glob(`${__dirname}/../**/*.js`, async (err, filePaths) => {

                    if (err) return console.log(err);
                    filePaths.forEach((file) => {
                        delete require.cache[require.resolve(file)];

                        const pull = require(file);

                        if (pull.name) {

                            client.commands.set(pull.name, pull);
                        }


                    });

                });

                msg.edit({
                    embeds: [reload.addField("Reloaded Message Commands", `${client.botEmoji.success} Reloaded the message commands!`).setColor(`${client.color.success}`)]
                })


                glob(`${__dirname} /../**/*.js`, async (err, filePaths) => {

                    if (err) return console.log(err);
                    filePaths.forEach((file) => {
                        delete require.cache[require.resolve(file)];

                        const pull = require(file);

                        if (pull.name) {

                            client.slashCommands.set(pull.name, pull);

                        }


                    });

                });

                msg.edit({ embeds: [reload.addField("Reloaded Slash Commands", `${client.botEmoji.success} Reloaded the slash commands!`).setColor(`${client.color.success}`)] }).then((msgg) => {
                    setTimeout(() => {
                        msgg.delete()
                    }, 2000)
                })

            }

        })

        collector.on("end", async (i) => { msg.delete() })


    }
}