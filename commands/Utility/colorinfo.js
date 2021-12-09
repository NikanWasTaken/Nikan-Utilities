const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: 'colorinfo',
    category: 'utility',
    description: `Info about a hex code`,
    cooldown: 5000,
    usage: `[hex code]`,
    botCommandOnly: true,


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, missingpartembed) => {

        var color = args[0]

        if (!color) return message.reply({ embeds: [missingpartembed] })
        if (color.includes("#")) {
            color = args[0].split("#")[1]
        }
        const url = (`https://api.alexflipnote.dev/colour/${color}`)
        let json
        try {

            json = await fetch(url).then(res => res.json())
        }
        catch (e) {
            return message.reply('An Error Occured, Try Again Later.')
        }

        if (json.description) return message.reply("Invalid hex code!")
        let embed = new MessageEmbed()
            .setTitle(json.name)
            .addField("RGB", json.rgb || "Not found!", true)
            .addField("Brightness", json.brightness ? "Not Found!" : json.brightness, true)
            .addField("Hex", json.hex || "Not Found!", true)
            .setThumbnail(json.image)
            .setImage(json.image_gradient, true)
            .setColor(json.hex)
        message.reply({ embeds: [embed] })



    }
}