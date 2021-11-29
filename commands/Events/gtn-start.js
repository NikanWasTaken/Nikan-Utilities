const { MessageEmbed, WebhookClient, Message, MessageActionRow, MessageButton } = require('discord.js')
const database = require("../../models/guessTheN.js")

module.exports = {
    name: 'gtn-start',
    category: 'Events',
    description: "Start a guess the number event!",
    usage: "[event token]",
    cooldown: 10000,


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, missingpartembed, modlog) => {

        var noperm = new MessageEmbed()
            .setDescription(`You don't have permissions to run this command.`)
            .setColor("#b3666c")

        var nochannel = new MessageEmbed()
            .setDescription(`You may only use this command in the threads created in the <#880401081497157643> channel.`)
            .setColor("#b3666c")

            var hostonly = new MessageEmbed()
            .setDescription(`Only the event host can use this command!`)
            .setColor("#b3666c")

        if (!message.member.roles.cache.get("880409157969256518")) return message.reply({ embeds: [noperm] }).then((msg) => { setTimeout(() => { msg.delete(), message.delete() }, 5000) })
        if (message.channel.parentId !== "880401081497157643") return message.reply({ embeds: [nochannel] })
        if(message.channel.ownerId !== message.author.id) return message.reply({ embeds: [hostonly] })



        try {

            const token = args[0]
            if (!token) return message.reply({ embeds: [missingpartembed] })

            const finddata = await database.findById(token)
            if (!finddata) return message.reply("Your event token is not valid!")

            await database.findByIdAndUpdate(token, { $set: { channelId: `${message.channel.id}` } }, async (data, err) => {
            })

            const tete = await database.findById(token)

            const eventchannel = client.channels.cache.get(`${tete.channelId}`)

            const embed = new MessageEmbed()
                .setAuthor(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
                .setTitle("Guess The Number Event")
                .setURL(`${client.server.invite}`)
                .addField("How this works?", `Basically guess the number is an event that you need to guess and write random numbers in the chat, it's based on your luck and your brain <:bigbrain:903363568420937799>\nThe bot have its eyes on the chat, if you write the right number, it will automaticlly lock the channel and announce the winner!\nEverytime the event is starting the bot will send a message like this and informations and hints will be sent below this message! `)
                .addField("● Event Information", `> Event Host: ${message.guild.members.cache.get(finddata.hostId)}\n> Numbers Range: ${finddata.range}\n> Time to guess: Umlimited\n> Chances to guess: Unlimited Chances\n> Prize: ${finddata.prize}`)
                .setFooter("Guess the number", client.user.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")


            await database.findByIdAndUpdate(token, { $set: { status: `Starting...` } }, async (data, err) => {
            })

            eventchannel.send({ embeds: [embed] })
            eventchannel.send("The event will start in 1 minute...")
            eventchannel.send({ content: "Please wait..."}).then(async (msg) => { 
                
            await setTimeout(() => { msg.edit("Starting in 30 seconds...") }, 30000);
            await setTimeout(() => { msg.edit("Starting in 15 seconds...") }, 45000);
            await setTimeout(() => { msg.edit("Starting in 5 seconds...") }, 55000);
            await setTimeout(() => { msg.edit("Starting in 4 seconds...") }, 56000);
            await setTimeout(() => { msg.edit("Starting in 3 seconds...") }, 57000);
            await setTimeout(() => { msg.edit("Starting in 2 seconds...") }, 58000);
            await setTimeout(() => { msg.edit("Starting in 1 second..."), eventchannel.setRateLimitPerUser(2) }, 59000);
            await setTimeout(() => { eventchannel.send("Unlocking the channel...") }, 60000);
            await setTimeout(() => { eventchannel.parent.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES_IN_THREADS: true }) }, 61000);

        })

        } catch (error) {
            console.log(error)
            message.reply("Your event token in not valid!")
        }



    }
}