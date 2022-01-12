const client = require("../../index.js")
const { MessageEmbed, WebhookClient } = require("discord.js")
const json = require("../../json/logs-config.json")
const color = "b59190"
const logs = new WebhookClient({
    id: "907254708492697610",
    token: "vvlOxZjTmd4bocdzgy7K6jwLu9Obf9Hcfj6HzpGqesdzcMBhyPxNNsZ4d3B0C24j4W0c"
})


client.on("messageDelete", async (message) => {

    try {

        if (message?.author?.bot) return;
        if (!message?.guild) return;
        if (message?.guildId !== `${client.server.id}`) return;
        if (json["message-ignores"].category.includes(message.channel.parentId)) return;
        if (json["message-ignores"].channel.includes(message.channelId)) return;
        if (json["message-ignores"].roles.some(roleid => message.member.roles.cache.has(roleid))) return;


        const embed = new MessageEmbed()
            .setAuthor({ name: `${message?.author?.tag}`, iconURL: `${message?.author?.displayAvatarURL({ dynamic: true })}` })
            .setTitle("Message Deleted")
            .setColor(color)
            .setDescription(message?.content ? `${message?.content}` : "No content in this message!")
            .addField("Channel", `${message?.channel}`, true)
            .addField("User", `${message?.author}`, true)
            .addField("Delete At", `<t:${~~(Date.now() / 1000)}:f>`, true)
            .setFooter({ text: `ID: ${message.id}` })
            .setTimestamp()

        if (message?.attachments.first()) {

            const attachments = message?.attachments?.map((a) => {
                Promise?.all()
                return [
                    `• [${a?.name?.toLowerCase()}](${a?.url?.toLowerCase()})`
                ]
            })

            embed.addField(`Attachments [${message?.attachments?.size}]`, `${attachments.join("\n")}`, false)
        }

        logs.send({ embeds: [embed] })

    } catch (error) { }
})



client.on("messageUpdate", async (OldMessage, newMessage) => {

    try {

        if (OldMessage.author?.bot) return;
        if (!OldMessage?.guild) return;
        if (OldMessage?.guildId !== `${client.server.id}`) return;
        if (json["message-ignores"].category.includes(OldMessage.channel.parentId)) return;
        if (json["message-ignores"].channel.includes(OldMessage.channelId)) return;
        if (json["message-ignores"].roles.some(roleid => OldMessage.member.roles.cache.has(roleid))) return;


        const embed = new MessageEmbed()
            .setAuthor({ name: `${OldMessage?.author?.tag}`, iconURL: `${OldMessage?.author?.displayAvatarURL({ dynamic: true })}` })
            .setTitle("Message Edited")
            .setColor(color)
            .addField("Channel", `${OldMessage?.channel}`, true)
            .addField("User", `${OldMessage?.author}`, true)
            .addField("Delete At", `<t:${~~(Date.now() / 1000)}:f>`, true)
            .addField("Old Message", OldMessage.content ? `${OldMessage.content.length > 1024 ? "The content is too long to show!" : `${OldMessage.content}`}` : "There is no content in this message!")
            .addField("New Message", newMessage.content ? `${newMessage.content.length > 1024 ? "The content is too long to show!" : `${newMessage.content}`}` : "There is no content in this message!")
            .setFooter({ text: `ID: ${newMessage.id}` })
            .setTimestamp()

        if (OldMessage?.attachments.first()) {

            const attachments = OldMessage?.attachments?.map((a) => {
                Promise?.all()
                return [
                    `• [${a?.name?.toLowerCase()}](${a?.url?.toLowerCase()})`
                ]
            })

            embed.addField(`Old Attachments [${OldMessage?.attachments?.size}]`, `${attachments.join("\n")}`, false)
        }

        if (newMessage?.attachments.first()) {

            const attachments = newMessage?.attachments?.map((a) => {
                Promise?.all()
                return [
                    `• [${a?.name?.toLowerCase()}](${a?.url?.toLowerCase()})`
                ]
            })

            embed.addField(`New Attachments [${newMessage?.attachments?.size}]`, `${attachments.join("\n")}`, false)
        }

        logs.send({ embeds: [embed] })

    } catch (error) { }
})