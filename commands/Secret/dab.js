const { Message, Client, MessageAttachment } = require('discord.js')

module.exports = {
    name: 'dab',
    category: 'Secret',
    description: 'Dabs <o/',
    aliases: ["<o/", '\\o>'],
    cooldown: 10000,
    permissions: ["MANAGE_MESSAGES"],
    visible: false,


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message) => {

        const one = "\\o>";
        const two = "<o/";

        await message.channel.send({
            content: one
        })
            .then((msg1) => {
                setTimeout(() => {
                    msg1.edit({ content: two })
                        .then((msg) => {
                            setTimeout(() => {
                                msg.edit({ content: one })
                                    .then((msg) => {
                                        setTimeout(() => {
                                            msg.edit({ content: two })
                                                .then((msg) => {
                                                    setTimeout(() => {
                                                        msg.edit({ content: one })
                                                            .then((msg) => {
                                                                setTimeout(() => {
                                                                    msg.edit({ content: two })
                                                                        .then((msg) => {
                                                                            setTimeout(() => {
                                                                                msg.edit({ content: one })
                                                                                    .then((msg) => {
                                                                                        setTimeout(() => {
                                                                                            msg.edit({ content: two })
                                                                                                .then((msg) => {
                                                                                                    setTimeout(() => {
                                                                                                        msg.edit({ content: two })
                                                                                                            .then((msg) => {
                                                                                                                setTimeout(() => {
                                                                                                                    msg.edit({ content: one })
                                                                                                                        .then((msg) => {
                                                                                                                            setTimeout(() => {
                                                                                                                                msg.edit({ content: two })
                                                                                                                                    .then((msg) => {
                                                                                                                                        setTimeout(() => {
                                                                                                                                            msg.edit({ content: one })
                                                                                                                                                .then((msg) => {
                                                                                                                                                    setTimeout(() => {
                                                                                                                                                        msg.edit({ content: two })
                                                                                                                                                            .then((msg) => {
                                                                                                                                                                setTimeout(() => {
                                                                                                                                                                    msg.edit({ content: one })
                                                                                                                                                                        .then((msg) => {
                                                                                                                                                                            setTimeout(() => {
                                                                                                                                                                                msg.edit({ content: two })
                                                                                                                                                                                    .then((msg) => {
                                                                                                                                                                                        setTimeout(() => {
                                                                                                                                                                                            msg.edit({ content: ' ', files: [new MessageAttachment("https://cdn.discordapp.com/attachments/923615856653643816/927157670123827210/774200274096226305.png", "dab.png")] })
                                                                                                                                                                                        }, 1000);
                                                                                                                                                                                    })
                                                                                                                                                                            }, 1000);
                                                                                                                                                                        })
                                                                                                                                                                }, 1000);
                                                                                                                                                            })
                                                                                                                                                    }, 1000);
                                                                                                                                                })
                                                                                                                                        }, 1000);
                                                                                                                                    })
                                                                                                                            }, 1000);
                                                                                                                        })
                                                                                                                }, 1000);
                                                                                                            })
                                                                                                    }, 1000);
                                                                                                })
                                                                                        }, 1000);
                                                                                    })
                                                                            }, 1000);
                                                                        })
                                                                }, 1000);
                                                            })
                                                    }, 1000);
                                                })
                                        }, 1000);
                                    })
                            }, 1000);
                        })
                }, 1000);
            })
    }
}