const { MessageEmbed, Collection } = require("discord.js");
const client = require("../../index");
const database = require("../../models/guessTheN.js")
const count = require("quick.db")


client.on("messageCreate", async (message) => {

    const eventchannel = client.channels.cache.get("903346633733996625")

    const data = await database.findOne({ guildId: message.guildId })
    if(!data) return

    if(data.status != "Starting...") return 

        let number = data.correctNumber;
        let hostID = data.hostId;

        count.add('count', 1)

        if (message.guild && message.channel.id === `${data.channelId}`) {

            if(message.content.toLowerCase().includes("hint") && message.author.id === hostID) return message.pin()

            if (parseInt(message.content) == number && message.author.id !== hostID) {

                const channelma = client.channels.cache.get(data.channelId)

                await channelma.parent.permissionOverwrites.edit(message.guild.roles.everyone, {
                    SEND_MESSAGES_IN_THREADS: false,

                }).catch(e => { console.log(e) })

                await message.react("✅").then(s => { }).catch(e => { console.log(e) })

                const embed = new MessageEmbed()
                    .setAuthor(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
                    .setTitle("Guess The Number Event Ended 🎉")
                    .setURL(`${client.server.invite}`)
                    .setDescription(`Congratulation ${message.author}!\nPlease dm ${message.guild.members.cache.get(hostID)} to claim your prize!`)
                    .addField("** **", `The Correct Number was **${number}**\nTotal Guesses: ${count.get("count")}`)
                    .setColor("BLUE")
                    .setFooter("Thanks For Participating!")
                    .setTimestamp()
                await message.channel.send({ embeds: [embed] })
                await message.pin().then(s => { }).catch(e => { console.log(e) })
                await database.findOneAndDelete({ guildId: message.guildId })
                await channelma.setRateLimitPerUser(0)
                await count.set('count', 0)
            }
        }

})