const client = require("../../index");
const ms = require("ms")
const config = client.config
const { Client, Collection, MessageEmbed, WebhookClient, MessageActionRow, MessageButton } = require("discord.js")
const Timeout = new Collection();
const cap = require("capitalize-first-letter");

// client.on('messageUpdate', async (oldMessage, newMessage) => {
//     if (newMessage?.author?.bot) return
//     if (!newMessage?.content?.length) return

//     client.emit('messageCreate', newMessage)
// });

client.on("messageCreate", async (message) => {


    var noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")

    // --

    const pingemebd = new MessageEmbed().setAuthor(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`👋 Hey I'm ${client.user.username}.\nMy prefixes are \`>\` and <:NUslashcommands:897085046710763550> commands.\nType \`>help\` or \`/help\` in bot command channels to see my commands!`)
        .setColor(`${client.color.noColor}`)
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>` && !message.author.bot) return message.reply({ embeds: [pingemebd] })

    if (
        message.author.bot ||
        !message.guild ||
        !message.content.toLowerCase().startsWith(client.config.prefix)
    )
        return;

    const eemebd = new MessageEmbed().setDescription(`You may only use this command in [${client.guilds.cache.get(client.server.id).name}](${client.server.invite})`).setColor(`${client.color.moderationRed}`)
    if (message.guildId !== client.server.id && !client.config.developers.includes(message.author.id)) return message.reply({ embeds: [eemebd] })

    var [cmd, ...args] = message.content
        .slice(client.config.prefix.length)
        .trim()
        .split(" ");

    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));
    if (!command) return;

    var devonly = new MessageEmbed().setDescription(`Only developers for ${client.user.username} can use this command!`).setColor(`${client.color.moderationRed}`)

    if (command.developerOnly && !client.config.developers.includes(message.author.id)) return message.reply({ embeds: [devonly] }).then((msg) => {
        setTimeout(() => {
            msg.delete()
            message.delete()
        }, 5000)
    })

    if (!message.member.permissions.has(command.userPermissions || [])) return message.reply({ embeds: [noperm] }).then((msg) => {
        setTimeout(() => {
            msg.delete()
            message.delete()
        }, 5000)
    })


    if (command.botCommandOnly === true && !message.channel.name.includes("command") && !message.member?.permissions?.has("ADMINISTRATOR")) {

        var botcmd = new MessageEmbed().setDescription('You may only use this command in bot command channels!').setColor(`${client.color.moderationRed}`)
        message.reply({ embeds: [botcmd] }).then((msg) => { setTimeout(() => { msg.delete(), message.delete() }, 5000) })

    } else {

        const missingpartembed = new MessageEmbed()
            .setAuthor(`${cap(command.name)} Command`, client.user.displayAvatarURL())
            .setDescription(`This command is missing an argument from the usage below!\n\n> **Usage:** ${command.usage ? `\`${config.prefix + command.name + ` ${command.usage}`}\`` : "No Usage found!"}\n> **Aliases:** ${command.aliases ? `\`${command.aliases.join("` `")}\`` : "No Aliases Available"}\n> **Cooldown:** ${command.cooldown ? ms(command.cooldown, { long: true }) : "No Cooldown"}`)
            .setColor("#b3666c")
            .setFooter(`Syntax: "[] = required", "<> = optional"`)
            .setTimestamp()

        if (command.cooldown && !message.member?.permissions?.has("ADMINISTRATOR")) {

            let lek = `${~~(Timeout.get(`${command.name}${message.author.id}`) - Date.now())}`
            let cooldownembed = new MessageEmbed().setColor(`${client.color.noColor}`).setDescription(`You need to wait \`${ms(parseInt(lek), { long: true })}\` to use the \`${command.name}\` command again.`)
            if (Timeout.has(`${command.name}${message.author.id}`))
                return message.reply({ embeds: [cooldownembed] })
            command.run(client, message, args, missingpartembed);
            Timeout.set(
                `${command.name}${message.author.id}`,
                Date.now() + command.cooldown
            );
            setTimeout(() => {
                Timeout.delete(`${command.name}${message.author.id}`);
            }, command.cooldown);

        } else {

            await command.run(client, message, args, missingpartembed);

        }
    }
});
