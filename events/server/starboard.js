const client = require("../../index.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const starCount = "2";
const SBchannelId = "868358834052296724";



client.on('messageReactionAdd', async (reaction) => {

    const starBoardChannel = client.channels.cache.get(SBchannelId)

    // if (reaction.message.author.id === user.id && reaction.emoji.name === "⭐") return reaction.message.reactions.resolve("⭐").users.remove(user.id) 

    // reqs
    if (reaction.message.channel.type === "DM") return;
    if (reaction.message.guildId !== `${client.server.id}`) return;
    if (reaction.message.channel.id === SBchannelId && reaction.message.author.id === `${client.user.id}`) return;
    if (reaction.count >= starCount && reaction.emoji.name === "⭐") {

        const msgs = await starBoardChannel.messages.fetch({ limit: 50 });

        const SentMessage = msgs.find(msg =>
            msg.embeds.length === 1 ?
                (msg.embeds[0].footer.text.endsWith(reaction.message.id) ? true : false) : false);

        if (SentMessage) {

            SentMessage.edit(`:star: **${reaction.count}** ● ${reaction.message.channel}`);

        } else {

            const jumprow = new MessageActionRow().addComponents(

                new MessageButton()
                    .setLabel("Jump to the message")
                    .setStyle("LINK")
                    .setURL(`https://discord.com/channels/${reaction.message.guildId}/${reaction.message.channel.id}/${reaction.message.id}`)
            )

            const embed = new MessageEmbed()
                .setAuthor(`${reaction.message.member.displayName}`, reaction.message.author.displayAvatarURL({ dynamic: true }))
                .addField("Content", `${reaction.message.content || "There is no content is this message!"}`)
                .setFooter(`ID: ${reaction.message.id}`)
                .setTimestamp()
                .setImage(reaction.message.attachments.first()?.proxyURL || null)
                .setColor(`${client.color.botBlue}`)

            await starBoardChannel.send({ content: `:star: **${reaction.count}** ● ${reaction.message.channel}`, embeds: [embed], components: [jumprow] })

        }
    }


})


client.on('messageReactionRemove', async (reaction, user) => {


    const starBoardChannel = client.channels.cache.get(SBchannelId)

    // reqs
    if (reaction.message.channel.type === "DM") return
    if (reaction.emoji.name === "⭐") {

        const msgs = await starBoardChannel.messages.fetch({ limit: 50 });

        const SentMessage = msgs.find(msg =>
            msg.embeds.length === 1 ?
                (msg.embeds[0].footer.text.endsWith(reaction.message.id) ? true : false) : false)


        if (SentMessage) {

            if (reaction.count >= starCount) {

                await SentMessage.edit(`:star: **${reaction.count}** ● ${reaction.message.channel}`);

            } else {

                await SentMessage?.delete()

            }
        }
    }

})