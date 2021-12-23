const { MessageEmbed } = require("discord.js")
/**
 * @param {Client} client
 */
module.exports = async (client) => {


    client.embeds = {
        noPermissions: new MessageEmbed()
            ?.setDescription("You don't have permissions to run this command.")
            ?.setColor("RED"),

        botCommand: new MessageEmbed()
            ?.setDescription('You may only use this command in bot command channels!')
            ?.setColor(`RED`),

        cannotPerform: new MessageEmbed()
            ?.setDescription(`You don't have permissions to perform that action!`)
            ?.setColor("RED")
    }


}