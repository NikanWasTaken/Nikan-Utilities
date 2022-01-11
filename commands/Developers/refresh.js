const { MessageEmbed, MessageButton, MessageActionRow, Message, Client } = require('discord.js')
require("dotenv").config()
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

module.exports = {
    name: 'refresh',
    category: 'Developers',
    aliases: ["reload", "reloadall"],
    cooldown: 10000,
    developer: true,
    visible: false,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message) => {

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
            .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setColor(`${client.color.serverPurple}`)
            .addField("Refresh Client", `If you want to refresh the bot's client`)
            .addField("Refresh Commands", `If you want to refresh legacy commands and slash commands.`)
            .setTimestamp()

        let msg = await message.channel.send({
            embeds: [embed],
            components: [components]
        })
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
                    .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setColor(`${client.color.loading}`)
                    .addField(`Refreshing`, `${client.emoji.load} Refreshing the client...`)

                let msg = await message.channel.send({ embeds: [refresh] })
                client.destroy()
                await client.login(`${process.env.TOKEN}`)
                await msg.edit({
                    embeds: [
                        refresh
                            .addField("Refreshed", `${client.emoji.success} The client has been refreshed!`)
                            .setColor(`${client.color.success}`)
                            .setTimestamp()
                    ]
                }).then((msg) => {
                    setTimeout(() => {
                        msg.delete()
                    }, 2000)
                })

            } else if (collected.customId === "reload") {

                if (collected.user.id !== message.author.id) return collected.reply({
                    content: "This menu is not for you!",
                    ephemeral: true
                })
                collector.stop()

                const reload = new MessageEmbed()
                    .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
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
                    embeds: [
                        reload
                            .addField("Reloaded legacy commands", `${client.emoji.success} Reloaded the legacy commands!`)
                            .setColor(`${client.color.success}`)
                    ]
                })

                const guild = client.guilds.cache.get(`888760200620834876`)
                await guild.commands.set([])
                const arrayOfSlashCommands = [];
                const slashCommands = await globPromise(
                    `${process.cwd()}/SlashCommands/*/*.js`
                );
                slashCommands.map((value) => {
                    const file = require(value);
                    if (!file?.name) return;
                    client.slashCommands.set(file.name, file);

                    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
                    if (file.permissions) file.defaultPermission = false
                    arrayOfSlashCommands.push(file);
                });

                await guild.commands.set(arrayOfSlashCommands)
                    .then((cmd) => {
                        const getRoles = (commandName) => {
                            const permissions = arrayOfSlashCommands.find(x => x.name === commandName).permissions;
                            if (!permissions) return null;
                            return guild.roles.cache.filter(x => x.permissions.has(permissions) && !x.managed)
                        }
                        const fullPermissions = cmd.reduce((accumulator, x) => {
                            const roles = getRoles(x.name)
                            if (!roles) return accumulator

                            const permissions = roles.reduce((a, v) => {
                                return [
                                    ...a, {
                                        id: v.id,
                                        type: "ROLE",
                                        permission: true
                                    }
                                ]
                            }, [])
                            return [
                                ...accumulator,
                                {
                                    id: x.id,
                                    permissions,
                                }
                            ]
                        }, [])

                        guild.commands.permissions.set({
                            fullPermissions
                        })

                    })

                msg.edit({
                    embeds: [
                        reload.
                            addField("Reloaded Slash Commands", `${client.emoji.success} Reloaded the slash commands!`)
                            .setColor(`${client.color.success}`)]
                }).then((msgg) => {
                    setTimeout(() => {
                        msgg.delete()
                    }, 2000)
                })
            }
        })
        collector.on("end", async () => {
            msg.delete()
        })
    }
}