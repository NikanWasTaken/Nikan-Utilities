const client = require("../../index.js");
const { MessageEmbed, MessageActionRow, MessageButton, WebhookClient } = require("discord.js");
const starCount = 3;
const SBchannelId = "868358834052296724";
const hook = new WebhookClient({
    id: '932867412460716062',
    token: 'vQS935IoFwVo2FxLk7Ku5y0NnNeXC0zZIr3IbJOzKmkdQoha-YDgS1Y4B_bpxzbifHj9'
});

client.on('messageReactionAdd', async (reaction) => {

    const starBoardChannel = client.channels.cache.get(SBchannelId)

    reaction?.fetch()
    reaction?.message?.fetch()
    // reqs
    if (reaction?.message?.channel.type === "DM") return;
    if (reaction?.message?.guildId !== `${client.server.id}`) return;
    if (
        reaction?.message?.channelId === SBchannelId &&
        reaction?.message?.author?.id === `${client.user.id}`
    ) return;
    if (reaction?.count >= starCount && reaction?.emoji.name === "⭐") {

        const msgs = await starBoardChannel.messages.fetch({ limit: 30 })

        const SentMessage = msgs?.find(msg =>
            msg?.embeds?.length === 1 &&
                msg?.author?.id === hook.id ?
                (msg.embeds[0]?.footer?.text?.endsWith(reaction?.message?.id) ? true : false) : false
        );

        if (SentMessage) {

            await hook.editMessage(SentMessage.id, { content: `:star: **${reaction?.count}** ● ${reaction?.message?.channel}` });

        } else {

            const jumprow = new MessageActionRow().addComponents(

                new MessageButton()
                    .setLabel("Jump to the message")
                    .setStyle("LINK")
                    .setURL(`https://discord.com/channels/${reaction?.message?.guildId}/${reaction?.message?.channel.id}/${reaction?.message?.id}`)
            )

            const embed = new MessageEmbed()
                .setAuthor({ name: `${reaction?.message?.member.displayName}`, iconURL: reaction?.message?.author.displayAvatarURL({ dynamic: true }) })
                .addField("Content", `${reaction?.message?.content || "There is no content is this message!"}`)
                .setFooter({ text: `ID: ${reaction?.message?.id}` })
                .setTimestamp()
                .setImage(reaction?.message?.attachments.first()?.proxyURL || null)
                .setColor(`${client.color.botBlue}`)

            await hook.send({
                content: `:star: **${reaction?.count}** ● ${reaction?.message?.channel}`,
                embeds: [embed],
                components: [jumprow]
            })
        }
    }
})


client.on('messageReactionRemove', async (reaction) => {


    reaction?.fetch()
    reaction?.message?.fetch()
    const starBoardChannel = client.channels.cache.get(SBchannelId)

    // reqs
    if (reaction?.message?.channel.type === "DM") return
    if (reaction?.emoji.name === "⭐") {

        const msgs = await starBoardChannel.messages.fetch({ limit: 30 });
        const SentMessage = msgs?.find(msg =>
            msg?.embeds?.length === 1 &&
                msg?.author?.id === hook.id ?
                (msg.embeds[0]?.footer?.text?.endsWith(reaction?.message?.id) ? true : false) : false
        );

        if (SentMessage) {

            if (reaction?.count >= starCount) {
                await hook.editMessage(SentMessage.id, { content: `:star: **${reaction?.count}** ● ${reaction?.message?.channel}` });

            } else {
                await hook.deleteMessage(SentMessage.id)

            }
        }
    }

})