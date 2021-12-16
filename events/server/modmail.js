const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, WebhookClient, Collection } = require("discord.js");
const client = require("../../index.js");
const prefix = client.config.prefix;
const modmailconfig = require("../../json/modmail.json");
const categoryId = modmailconfig.category;
const blacklist = require("../../models/modmail-blacklist.js")
const GuessTheNumber = require("../../models/guessTheN.js")
const serverId = client.server.id
const ms = require("ms")
const cooldown = new Collection()
let loghook = new WebhookClient({
    id: `${modmailconfig.hookId}`,
    token: `${modmailconfig.hookToken}`,
}); // https://discord.com/api/webhooks/910091774180081704/Reqy5hiVvGPp4HzaqnLNrhOQIt7X__2QwvQuNp2FzeetqZeEHbkbecPFNGdHyJ_QG6Ra


client.on("channelDelete", (channel) => {

    if (channel.parentId === categoryId) {
        const person = channel.guild.members.cache.find((x) => x.id == channel.name)
        if (!person) return;

        const embed = new MessageEmbed()
            .setAuthor(`${client.guilds.cache.get(serverId).name}`, `${client.guilds.cache.get(serverId).iconURL({ dynamic: true })}`)
            .setTitle("Thread Closed").setURL(`${client.server.invite}`)
            .setDescription(`Your thread has been closed by a staff member, thanks for contacting ${client.guilds.cache.get(serverId).name}. If you got more problems, feel free to open a thread and ask your question again!`)
            .setColor(`${client.color.botBlue}`)
            .setFooter(`Thread has been closed`)
            .setTimestamp()

        return person.send({ embeds: [embed] }).catch(e => { return })
    }


})


client.on("messageCreate", async (message) => {

    const category = client.channels.cache.get(categoryId)

    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    // let command = args.shift().toLowerCase();


    if (message.channel.parentId) {

        if (message.channel.parentId == category) {

            let member = message.guild.members.cache.get(message.channel.name)
            if (!member) return message.channel.send("Could not send the message because I'm not able to find a member in this guild matching this channel's Id!'")

            const respondembed = new MessageEmbed()
                .setAuthor("Staff Team", "https://cdn.discordapp.com/attachments/870637449158742057/909825851225427978/staff-icon.png")
                .setDescription(`${message.content ? message.content : `No content in this message!`}`)
                .setImage(message.attachments.first()?.proxyURL || null)
                .setColor(`${client.color.botBlue}`)

                ; (await member).send({ embeds: [respondembed] }).catch(e => { return message.channel.send({ content: "This person has closed his dms, couldn't dm them!" }), message.reactions.removeAll(), message.react(`${client.emoji.failed}`) })
            await message.react(`${client.emoji.success}`)

        }


    }

    if (!message.guild) {

        const find = await blacklist.findOne({ userId: `${message.author.id}`, guildId: `${serverId}` })

        if (find) {

            const edie = new MessageEmbed()
                .setAuthor(`${client.guilds.cache.get(serverId).name}`, `${client.guilds.cache.get(serverId).iconURL({ dynamic: true })}`)
                .setTitle("Blacklisted From Opening Threads").setURL(`${client.server.invite}`)
                .setDescription("Sorry, but you've been blacklisted from opening modmail threads.\nIf you think that this punishment is not fair and you don't deserve it, please contact a head moderator or above!")
                .addField("Reason", `${await find.reason}`, true)
                .setColor(`${client.color.moderationRed}`)
                .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL()}`)

            return message.channel.send({ embeds: [edie] })

        }

        const guild = await client.guilds.cache.get(serverId) || await client.guilds.fetch(serverId).catch(m => { })
        if (!guild) return;
        if (!category) return;
        const personticket = guild.channels.cache.find((x) => x.name == message.author.id)


        if (!personticket) {

            let lek = `${~~(cooldown.get(`Modmail${message.author.id}`) - Date.now())}`

            if (cooldown.has(`Modmail${message.author.id}`)) return message.channel.send(`You need to wait **${ms(parseInt(lek), { long: true })}** to open a thread again!`)

            if (!client.guilds.cache.get(serverId).members.cache.get(`${message.author.id}`).roles.cache.get("793410990535999508")) return
            const gtn = await GuessTheNumber.findOne({ hostId: message.author.id, guildId: serverId, status: "In process..." })
            if (gtn) return


            const dmbuttons = new MessageActionRow().addComponents(

                new MessageButton()
                    .setLabel("Create")
                    .setStyle("SUCCESS")
                    .setCustomId("create-ticket"),

                new MessageButton()
                    .setLabel("Cancel")
                    .setStyle("DANGER")
                    .setCustomId("cancel-ticket"),
            )

            let areusure = new MessageEmbed()
                .setAuthor(`${client.guilds.cache.get(serverId).name}`, `${client.guilds.cache.get(serverId).iconURL({ dynamic: true })}`)
                .setTitle("Are you sure that you want to create a thread?").setURL(`${client.server.invite}`)
                .setDescription("Please open a thread if you're sure that your question is related to an option below!\nCreating tickets for trolling reasons will get you different punishments!")
                .addField("** **", `**➜ #1 Reporting A User**\nYou can report users for the stuff happened in ${client.guilds.cache.get(serverId).name}! This can include people who are breaking the rules, dm advertising, sending you gore content etc..\n\n**➜ #2 Request Role**\nYou can open a thread if you want to get a role in ${client.guilds.cache.get(serverId)}! These roles can only be the creator roles, giveaways, event host etc.. Please do not open a thread for free staff roles.\n\n**➜ #3 Appeal**\nYou can create a thread if you want to appeal a warning/mute given by a **moderator** to you. You may not ask for auto moderation warns removal as they expire after 2 days!\n\n**➜ #4 Any Other Question**\nYou can create a thread if you want to ask a question about the server. For example: How do I suggest something to the server.`)
                .setColor(`${client.color.botBlue}`)
                .setFooter("Please click the buttons below to choose your action!")

            const comsg = await message.channel.send({ embeds: [areusure], components: [dmbuttons] })

            cooldown.set(
                `Modmail${message.author.id}`,
                Date.now() + 20000
            );
            setTimeout(() => {
                cooldown.delete(`Modmail${message.author.id}`);
            }, 20000);

            const collector = comsg.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 20000,
            })

            collector.on('collect', async (collected) => {

                if (collected.customId === "cancel-ticket") {

                    const embed = new MessageEmbed()
                        .setAuthor(`${client.guilds.cache.get(serverId).name}`, `${client.guilds.cache.get(serverId).iconURL({ dynamic: true })}`)
                        .setTitle("Ticket Creation Has Been Canceled").setURL(`${client.server.invite}`)
                        .setColor(`${client.color.failed}`)
                        .setDescription("Your ticket creation has been cancelled according to your button choice!")
                        .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                        .setTimestamp()

                    collector.stop()
                    await collected.update({ embeds: [embed], components: [] })

                } else if (collected.customId === "create-ticket") {

                    const createdembed = new MessageEmbed()
                        .setAuthor(`${client.guilds.cache.get(serverId).name}`, `${client.guilds.cache.get(serverId).iconURL({ dynamic: true })}`)
                        .setTitle("Thread Created").setURL(`${client.server.invite}`)
                        .setColor(`${client.color.success}`)
                        .setDescription("Your thread has been created!\nPlease write your question here and don't wait for a staff member to tell you about asking the question.\nBe patient & wait for a staff member to respond, we'll get to you as soon as possible!")
                        .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                        .setTimestamp()

                    collector.stop()
                    await collected.update({ embeds: [createdembed], components: [] })

                    const ticketchannel = client.guilds.cache.get(serverId).channels.create(message.author.id, {
                        type: "GUILD_TEXT",
                        parent: category.id,
                        topic: `This channel has been made according to the ticket created by ${message.author.tag} - (*${message.author.id}*)`,
                        reason: `Ticket channel created by ${message.author.tag}'s request!`
                    })

                    const infoinchannel = new MessageEmbed()
                        .setAuthor(`${client.guilds.cache.get(serverId).name}`, `${client.guilds.cache.get(serverId).iconURL({ dynamic: true })}`)
                        .setDescription("These are all the information about the person who created this thread!")
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                        .addField("__**Account Information**__", `**Username** • ${message.author.username}\n**ID** • ${message.author.id}\n**discriminator** • #${message.author.discriminator}\n**Tag** • ${message.author.tag}\n**Registered** • <t:${~~(message.author.createdAt / 1000)}:f> [<t:${~~(message.author.createdAt / 1000)}:R>]\n** **`)
                        .addField("__**Server Member Information**__", `**Nickname** • ${message.author.username == client.guilds.cache.get(serverId).members.cache.get(message.author.id).displayName ? `No Nickname in ${client.guilds.cache.get(serverId).name}` : client.guilds.cache.get(serverId).members.cache.get(message.author.id).displayName}\n**Joined** • <t:${~~(client.guilds.cache.get(serverId).members.cache.get(message.author.id).joinedAt / 1000)}:f> [<t:${~~(client.guilds.cache.get(serverId).members.cache.get(message.author.id).joinedAt / 1000)}:R>]`)
                        .setColor(`${client.color.botBlue}`)
                        .setFooter(`${client.user.username}`, client.user.displayAvatarURL())
                        .setTimestamp()

                        // <@&867685674496950272>
                        ; (await ticketchannel).send({ content: "Looks like there is someone here!", embeds: [infoinchannel], allowedMentions: { parse: ["roles"] } })

                    let log = new MessageEmbed()
                        .setAuthor(`Ticket Created`, client.guilds.cache.get(serverId).iconURL({ dynamic: true }))
                        .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
                        .setColor(`${client.color.botBlue}`)
                        .addField('Member Info', `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
                        .setTimestamp()

                    loghook.send({ embeds: [log] })


                }



            })

            collector.on("end", async (collected) => {

                const emobed = new MessageEmbed()
                    .setAuthor(`${client.guilds.cache.get(serverId).name}`, `${client.guilds.cache.get(serverId).iconURL({ dynamic: true })}`)
                    .setTitle("Thread Creation Timed Out!").setURL(`${client.server.invite}`)
                    .setDescription("Your ticket creation proccess timed out due to your late respond! If you want to create another thread, please message the bot again!")
                    .setColor("RED")
                    .setTimestamp()


                comsg.edit({ embeds: [emobed], components: [] })
            })


        }

        try {

            const embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${message.content ? message.content : `No content in this message!`}`)
                .setImage(message.attachments.first()?.proxyURL || null)
                .setColor(`${client.color.botBlue}`)
                .setFooter(`${message.author.id}`)

                ; (await personticket).send({ embeds: [embed] })
            message.react(`${client.emoji.success}`)

        } catch (error) {

        }

    }

})