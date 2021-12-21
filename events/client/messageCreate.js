const client = require("../../index");
const ms = require("ms")
const config = client.config
const { Collection, MessageEmbed } = require("discord.js")
const Timeout = new Collection();
const cap = require("capitalize-first-letter");

const noPermissions = new MessageEmbed()
    .setDescription("You don't have permissions to run this command.")
    .setColor(`${client.color.moderationRed}`)


const botCommand = new MessageEmbed()
    .setDescription('You may only use this command in bot command channels!')
    .setColor(`${client.color.moderationRed}`)

client.on("messageCreate", async (message) => {

    // prefix check
    if (
        message.author.bot ||
        !message.guild ||
        !message.content.toLowerCase().startsWith(client.config.prefix)
    ) return;


    // define args
    var [cmd, ...args] = message.content
        .slice(client.config.prefix.length)
        .trim()
        .split(" ");


    // command check
    const command =
        client.commands.get(cmd.toLowerCase()) ||
        client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));
    if (!command) return;


    // developer commands check
    if (
        command.developer &&
        !client.config.developers.includes(message.author.id)
    ) return message.reply({ embeds: [noPermissions] })
        .then((msg) => {
            setTimeout(() => {
                msg?.delete()
                message?.delete()
            }, 5000)
        });


    // staff commands check
    if (
        !message.member.permissions.has(command.permissions || []) &&
        message.author.id !== client.config.owner
    ) return message.reply({ embeds: [noPermissions] }).then((msg) => {
        setTimeout(() => {
            msg?.delete()
            message?.delete()
        }, 5000)
    })


    // bot command check
    if (
        command.botCommand === true &&
        !message.channel.name.includes("command") &&
        !message.member?.permissions?.has("ADMINISTRATOR") &&
        !client.config.developers.includes(message?.author?.id) &&
        message.author.id !== client.config.owner
    ) return message.reply({ embeds: [botCommand] })
        .then((msg) => {
            setTimeout(() => {
                msg?.delete()
                message?.delete()
            }, 5000)
        });


    const wrongUsage = new MessageEmbed()
        .setAuthor(`${cap(command.name)} Command`, client.user.displayAvatarURL())
        .setDescription(
            [
                `This command is missing an argument from the usage below!\n`,
                `> **Usage:** ${command.usage ? `\`${config.prefix + command.name + ` ${command.usage}`}\`` : "No Usage found!"}`,
                `> **Aliases:** ${command.aliases ? `\`${command.aliases.join("` `")}\`` : "No Aliases Available"}`,
                `> **Cooldown:** ${command.cooldown ? ms(command.cooldown, { long: true }) : "No Cooldown"}`,
            ].join("\n")
        )
        .setColor(`${client.color.moderationRed}`)
        .setFooter(`[] = required" • <> = optional`)
        .setTimestamp()

    if (
        command.cooldown &&
        !message.member?.permissions?.has("ADMINISTRATOR") &&
        message.author.id !== client.config.owner
    ) {

        let cooldownRemaining = `${~~(Timeout.get(`${command.name}${message.author.id}`) - Date.now())}`
        let cooldownEmbed = new MessageEmbed()
            .setColor(`${client.color.invisible}`)
            .setDescription(`You need to wait \`${ms(parseInt(cooldownRemaining), { long: true })}\` to use the \`${command.name}\` command again.`);

        if (Timeout.has(`${command.name}${message.author.id}`))
            return message.reply({ embeds: [cooldownEmbed] })
                .then((msg) => {
                    setTimeout(() => {
                        msg?.delete()
                        message?.delete()
                    }, 5000)
                });

        command.run(client, message, args, wrongUsage);
        Timeout.set(
            `${command.name}${message.author.id}`,
            Date.now() + command.cooldown
        );
        setTimeout(() => {
            Timeout.delete(`${command.name}${message.author.id}`);
        }, command.cooldown);

    } else {

        await command.run(client, message, args, wrongUsage);

    }
});
