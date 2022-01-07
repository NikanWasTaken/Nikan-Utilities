const { MessageEmbed, Message, Client } = require('discord.js')
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

    run: async ({ client, message, args, wrongUsage }) => {


        var noChannel = new MessageEmbed()
            .setDescription(`You may only use this command in the threads created in the <#880401081497157643> channel.`)
            .setColor("RED")

        var hostOnly = new MessageEmbed()
            .setDescription(`Only the event host can use this command!`)
            .setColor("RED")

        if (!message.member.roles.cache.get("880409157969256518"))
            return message.reply({ embeds: [client.embed.noPermissions] })
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete(),
                            message.delete()
                    }, 5000)
                })

        if (message.channel.parentId !== "880401081497157643")
            return message.reply({ embeds: [noChannel] })
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete(),
                            message.delete()
                    }, 5000)
                })
        if (message.channel.ownerId !== message.author.id)
            return message.reply({ embeds: [hostOnly] })
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete(),
                            message.delete()
                    }, 5000)
                })



        try {

            const token = args[0]
            if (!token) return message.reply({ embeds: [wrongUsage] })

            const finddata = await database.findById(token)
            if (!finddata) return message.reply("Your event token is not valid!")

            await database.findByIdAndUpdate(token, { $set: { channelId: `${message.channel.id}` } }, async () => {
            })

            const tete = await database.findById(token)

            const eventchannel = client.channels.cache.get(`${tete.channelId}`)

            const embed = new MessageEmbed()
                .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTitle("Guess The Number Event")
                .setURL(`${client.server.invite}`)
                .addField("How this works?", `Basically guess the number is an event that you need to guess and write random numbers in the chat, it's based on your luck and your brain <:bigbrain:903363568420937799>\nThe bot have its eyes on the chat, if you write the right number, it will automaticlly lock the channel and announce the winner!\nEverytime the event is starting the bot will send a message like this and informations and hints will be sent below this message! `)
                .addField("● Event Information", `> Event Host: ${message.guild.members.cache.get(finddata.hostId)}\n> Numbers Range: ${finddata.range}\n> Time to guess: Umlimited\n> Chances to guess: Unlimited Chances\n> Prize: ${finddata.prize}`)
                .setFooter("Guess the number", client.user.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")


            await database.findByIdAndUpdate(token, { $set: { status: `Starting...` } }, async () => {
            })

            eventchannel.send({ embeds: [embed] })
            eventchannel.send("The event will start in 1 minute...")
            eventchannel.send({ content: "Please wait..." }).then(async (msg) => {

                setTimeout(() => { msg.edit("Starting in 30 seconds...") }, 30000);
                setTimeout(() => { msg.edit("Starting in 15 seconds...") }, 45000);
                setTimeout(() => { msg.edit("Starting in 5 seconds...") }, 55000);
                setTimeout(() => { msg.edit("Starting in 4 seconds...") }, 56000);
                setTimeout(() => { msg.edit("Starting in 3 seconds...") }, 57000);
                setTimeout(() => { msg.edit("Starting in 2 seconds...") }, 58000);
                setTimeout(() => { msg.edit("Starting in 1 second..."), eventchannel.setRateLimitPerUser(2) }, 59000);
                setTimeout(() => { eventchannel.send("Unlocking the channel...") }, 60000);
                setTimeout(() => { eventchannel.parent.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES_IN_THREADS: true }) }, 61000);

            })

        } catch (error) {
            console.log(error)
            message.reply("Your event token in not valid!")
        }
    }
}