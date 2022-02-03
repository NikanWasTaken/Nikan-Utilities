const { MessageEmbed, Client, Collection } = require("discord.js")
/**
 * @param {Client} client
 */
module.exports = async (client) => {

    let deleteMessageFunction = function (message, msg) {
        setTimeout(() => {
            message?.delete()
            msg?.delete()
        }, 5000)
    }

    let deleteInteractionFunction = function (interaction) {
        setTimeout(() => {
            interaction?.deleteReply()
        }, 5000)
    }

    client.util = {
        cooldown: {
            warn: new Collection()
        },
        embed: {
            noPermissions: new MessageEmbed()
                ?.setDescription("You don't have permissions to run this command.")
                ?.setColor("RED"),

            botCommand: new MessageEmbed()
                ?.setDescription('You may only use this command in bot command channels!')
                ?.setColor(`RED`),

            cannotPerform: new MessageEmbed()
                ?.setDescription(`You don't have permissions to perform that action!`)
                ?.setColor("RED"),
            cannotUse: new MessageEmbed()
                ?.setDescription("Whoops, but you can't use this command in this server.")
                ?.setColor("RED")
        },
        delete: {
            message: deleteMessageFunction,
            interaction: deleteInteractionFunction
        }
    }

}