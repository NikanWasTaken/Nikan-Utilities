const client = require("../../index");
const config = client.config
const { Collection, MessageEmbed } = require("discord.js")
const Timeout = new Collection();

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
    ) return message.reply({ embeds: [client.embeds.noPermissions] })
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
    ) return message.reply({ embeds: [client.embeds.noPermissions] }).then((msg) => {
        setTimeout(() => {
            msg?.delete()
            message?.delete()
        }, 5000)
    })


    // bot command check
    function channelCheck(message) {
        if (
            message.channel.name.includes("command") &&
            message.channel.name.includes("music") ||
            !message.channel.name.includes("command") &&
            message.channel.name.includes("music")
        ) return true;
        if (
            !message.channel.name.includes("command") &&
            !message.channel.name.includes("music") ||
            message.channel.name.includes("command") &&
            !message.channel.name.includes("music")
        ) return false;
    }
    if (
        command.botCommand === true &&
        channelCheck(message) &&
        !message.member?.permissions?.has("ADMINISTRATOR") &&
        !client.config.developers.includes(message?.author?.id) &&
        message.author.id !== client.config.owner
    ) return message.reply({ embeds: [client.embeds.botCommand] })
        .then((msg) => {
            setTimeout(() => {
                msg?.delete()
                message?.delete()
            }, 5000)
        });


    const wrongUsage = new MessageEmbed()
        .setAuthor({ name: `${client.cap(command.name)} Command`, iconURL: client.user.displayAvatarURL() })
        .setDescription(
            [
                `This command is missing an argument from the usage below!\n`,
                `> **Usage:** ${command.usage ? `\`${config.prefix + command.name + ` ${command.usage}`}\`` : "No Usage found!"}`,
                `> **Aliases:** ${command.aliases ? `\`${command.aliases.join("` `")}\`` : "No Aliases Available"}`,
                `> **Cooldown:** ${command.cooldown ? client.convert.time(command.cooldown / 1000) : "No Cooldown"}`,
            ].join("\n")
        )
        .setColor(`${client.color.moderationRed}`)
        .setFooter({ text: `[] = required • <> = optional` })
        .setTimestamp()


    if (
        command.cooldown &&
        !message.member?.permissions?.has("ADMINISTRATOR") &&
        message.author.id !== client.config.owner
    ) {

        let cooldownRemaining = `${~~(Timeout.get(`${command.name}${message.author.id}`) - Date.now())}`
        let cooldownEmbed = new MessageEmbed()
            .setColor(`${client.color.invisible}`)
            .setDescription(`You need to wait \`${client.convert.time(parseInt(~~(cooldownRemaining / 1000)))}\` to use this command again.`);

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
        command.run(client, message, args, wrongUsage);
    }


});
