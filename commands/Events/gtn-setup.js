const { MessageEmbed, WebhookClient, Message, MessageActionRow, MessageButton } = require('discord.js')
const database = require("../../models/guessTheN.js")

module.exports = {
    name: 'gtn-setup',
    category: 'Events',
    description: "Set up a guess the number event!",
    cooldown: 10000,


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, missingpartembed) => {

        var noperm = new MessageEmbed()
            .setDescription(`You don't have permissions to run this command.`)
            .setColor("#b3666c")

        if (!message.member.roles.cache.get("880409157969256518")) return message.reply({ embeds: [noperm] }).then((msg) => { setTimeout(() => { msg.delete(), message.delete() }, 5000) })


        const databrr = await database.findOne({ guildId: message.guildId })

        if (!databrr) {

            message.reply("Alright, setup will start soon, please check your dms!")


            const eeee = new database({
                correctNumber: "In process...",
                hostId: `${message.author.id}`,
                guildId: `757268973674037315`,
                prize: "In process...",
                totalGuesses: "In process...",
                status: "In process...",
            })
            eeee.save()

            const confirmation = new MessageEmbed().setTitle(`<:guess_the_number:903189197257592872> Confirmation`).setDescription(`\`\`\`Are you sure that you want to start this setup and you want to host this guess the number event? Please type "yes" or "no" in the chat to continue!\`\`\``).setColor("ORANGE").setFooter("You have 2 minutes to use this, after this, the bot won't respond!")
            const firstmsg = message.member.send({ embeds: [confirmation] }).catch(e => { return message.channel.send("Looks like your dms are closed, you need to open them for the setup process!") })
            const dmchannel = (await firstmsg).channel


            const confirmationcollector = dmchannel.createMessageCollector({ time: 120000, min: 1 });

            confirmationcollector.on('collect', async (m) => {

                if (m.author.bot) return
                if (m.content.toLowerCase() == "cancel") { return dmchannel.send("Canceled!"), await database.findByIdAndDelete(`${eeee._id}`), confirmationcollector.stop() }

                if (m.content.toLowerCase() == "yes") {

                    const yes = new MessageEmbed().setDescription("Alright, Continuing the setup process!").setColor("GREEN")
                    await dmchannel.send({ embeds: [yes] })
                    await m.react("✅")

                    confirmationcollector.stop()


                    const meow = new MessageEmbed().setDescription("You can cancel the setup process whenever you want by simply writring `cancel` in the chat!").setColor("YELLOW")
                    const firstq = new MessageEmbed().setTitle("<:guess_the_number:903189197257592872> Question #1`").setDescription(`\`\`\`That is the numbers range? This means the correct number is between these 2 numbers!\nPlease use the correct format for the bot to detect these 2 numbers: "(firstnumber) / (secondNumber)". Example: 1 / 500\nDon't forget to put the space between slash and the 2 numbers!\`\`\``).setColor("ORANGE").setFooter("You have 2 minutes to use this, after this, the bot won't respond!")
                    await dmchannel.send({ embeds: [meow] })
                    await dmchannel.send({ embeds: [firstq] })

                    const firstc = dmchannel.createMessageCollector({ time: 120000, min: 1 });

                    firstc.on('collect', async (m) => {

                        if (m.author.bot) return
                        if (m.content.toLowerCase() == "cancel") { return dmchannel.send("Canceled!"), await database.findByIdAndDelete(`${eeee._id}`), firstc.stop() }
                        const check = m.content.split(" / ")

                        database.findOneAndUpdate({ guildId: "757268973674037315", hostId: `${m.author.id}` }, { $set: { range: `${check[0]} to ${check[1]}` } }, async (data, err) => {

                        })

                        const alr = new MessageEmbed().setDescription(`Alright, the numbers range has been set to **${check[0]} to ${check[1]}**.`).setColor("YELLOW")
                        await dmchannel.send({ embeds: [alr] })
                        await firstc.stop()


                        const secondq = new MessageEmbed().setTitle("<:guess_the_number:903189197257592872> Question #2`").setDescription(`\`\`\`What is the correct number? The winner will be chosen if someone guess this number. Make sure that you're choosing the correct number because this can't be changed later!\`\`\``).setColor("ORANGE").setFooter("You have 2 minutes to use this, after this, the bot won't respond!")
                        await dmchannel.send({ embeds: [secondq] })
                        const secondc = dmchannel.createMessageCollector({ time: 120000, min: 1 });

                        secondc.on('collect', async (m) => {


                            if (m.author.bot) return
                            if (m.content.toLowerCase() == "cancel") { return dmchannel.send("Canceled!"), await database.findByIdAndDelete(`${eeee._id}`), secondc.stop() }
                            if (isNaN(m.content)) return dmchannel.send("Invalid Number, please try again but this time provide a valid number!")


                            database.findOneAndUpdate({ guildId: "757268973674037315", hostId: `${m.author.id}` }, { $set: { correctNumber: `${m.content}` } }, async (data, err) => {

                            })

                            const yestwo = new MessageEmbed().setDescription(`Alright, The correct number has been set to **${m.content}**`).setColor("GREEN")
                            await dmchannel.send({ embeds: [yestwo] })
                            await m.react("✅")
                            secondc.stop()



                            const thirdq = new MessageEmbed().setTitle("<:guess_the_number:903189197257592872> Question #3`").setDescription(`\`\`\`What's the prize for this event?\`\`\``).setColor("ORANGE").setFooter("You have 2 minutes to use this, after this, the bot won't respond!")
                            await dmchannel.send({ embeds: [thirdq] })

                            const thirdc = dmchannel.createMessageCollector({ time: 120000, min: 1 });

                            thirdc.on('collect', async (m) => {

                                if (m.author.bot) return
                                if (m.content.toLowerCase() == "cancel") { return dmchannel.send("Canceled!"), await database.findByIdAndDelete(`${eeee._id}`), thirdc.stop() }

                                database.findOneAndUpdate({ guildId: "757268973674037315", hostId: `${m.author.id}` }, { $set: { prize: `${m.content}` } }, async (data, err) => {

                                })

                                const yestwo = new MessageEmbed().setDescription(`Alright, The prize has been set to **${m.content}**`).setColor("GREEN")
                                await dmchannel.send({ embeds: [yestwo] })
                                await m.react("✅")
                                thirdc.stop()

                                const row = new MessageActionRow().addComponents(

                                    new MessageButton()
                                        .setLabel("Save All")
                                        .setStyle("SUCCESS")
                                        .setCustomId("yes-setup-gtn"),

                                    new MessageButton()
                                        .setLabel("Delete All")
                                        .setStyle("DANGER")
                                        .setCustomId("no-setup-gtn"),
                                )

                                const okk = new MessageEmbed()
                                    .setAuthor(`${client.guilds.cache.get("757268973674037315").name}`, client.guilds.cache.get("757268973674037315").iconURL({ dynamic: true }))
                                    .setTitle("Are you sure?")
                                    .setColor("YELLOW")
                                    .setURL(`${client.server.invite}`)
                                    .setDescription("Are you sure that you want to save all of these data?\nBy accepting this message using the buttons all of the data you told me is going to get saved in the database!")
                                    .setFooter("Status: waiting for acception")
                                    .setTimestamp()

                                dmchannel.send({ embeds: [okk], components: [row] })

                                const collector = dmchannel.createMessageComponentCollector({
                                    componentType: "BUTTON",
                                    time: 120000,
                                })

                                collector.on("collect", async (collected) => {

                                    if (collected.customId === "yes-setup-gtn") {

                                        const embed = new MessageEmbed()
                                            .setAuthor(`${client.guilds.cache.get("757268973674037315").name}`, client.guilds.cache.get("757268973674037315").iconURL({ dynamic: true }))
                                            .setTitle("Data has been saved")
                                            .setColor("GREEN")
                                            .setURL(`${client.server.invite}`)
                                            .setDescription("All the data you have told me has been saved in the database!")
                                            .setFooter("Status: accpeted • saved")
                                            .setTimestamp()

                                        collected.update({ embeds: [embed], components: [] })


                                        database.findOneAndUpdate({ guildId: "757268973674037315", hostId: `${collected.user.id}` }, { $set: { status: `saved and ready to get started` } }, async (data, err) => {

                                        })


                                        const howtod = new MessageEmbed()
                                            .setAuthor(`Your guess the number event token`, collected.user.displayAvatarURL({ dynamic: true }))
                                            .setDescription(`\`\`\`${eeee._id}\`\`\``)
                                            .setColor(`${client.color.noColor}`)
                                            .setFooter("You will need this token when you want to start your event!")
                                        await dmchannel.send({ content: "** **", embeds: [howtod] })



                                    } else if (collected.customId === "no-setup-gtn") {

                                        const embed = new MessageEmbed()
                                            .setAuthor(`${client.guilds.cache.get("757268973674037315").name}`, client.guilds.cache.get("757268973674037315").iconURL({ dynamic: true }))
                                            .setTitle("Data has been removed")
                                            .setColor("RED")
                                            .setURL(`${client.server.invite}`)
                                            .setDescription("All the saved data has been removed, if you want to start again please run the setup command in the server again!")
                                            .setFooter("Status: denied • all removed")
                                            .setTimestamp()

                                        collected.update({ embeds: [embed], components: [] })

                                        await database.findOneAndDelete({ guildId: "757268973674037315", hostId: `${collected.user.id}` })

                                    }

                                })


                            })



                        })

                    })




                } else if (m.content.toLowerCase() == "no") {

                    const no = new MessageEmbed().setDescription("Alright, I cancelled the set up process!").setColor("RED")
                    await dmchannel.send({ embeds: [no] })
                    confirmationcollector.stop()

                } else {
                    await m.react("❌")
                    await dmchannel.send("Invalid Usage, try again but this time make sure to write **Yes** or **No**")
                }

            })

        } else {
            const bla = new MessageEmbed().setDescription(`This server has already data queued for the user: ${message.guild.members.cache.get(databrr.hostId)}\nThey need to start their event before you can queue your own one!`).setColor("RED")
            message.reply({ embeds: [bla] })
        }

    }

}

