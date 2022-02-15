const client = require("../../index.js")
const { MessageEmbed, Role } = require("discord.js")
const memberRoles = require("../../models/LeftMembers.js")
const ms = require("ms")


client.on("guildMemberAdd", member => {

    if (member.guild.id !== `${client.server.id}`) return
    const welcomechannel = client.channels.cache.get('791152934045614121');

    memberRoles.findOne({ guildId: member.guild.id, userId: member.user.id }, async (err, data) => {

        if (err) throw err;
        if (data) {
            data.roles.map((w) => member.roles.set(w))
            await memberRoles.findOneAndDelete({ user: member.user.id, guildid: member.guild.id })

            const textArray = [
                `${member.user} just showed up.. not for the first time!`,
                `${member.user} just landed.. but not for the first time!`,
                `${member.user} re-joined the party!`,
                `Welcome back ${member.user}. Say hi!`,
                `Good to see you back, ${member.user}!`,
                `${member.user} is here again!`,
                `Glad you're here again, ${member.user}.`,
                `Everyone welcome back ${member.user}.`,
                `A wild ${member.user} re-appeared.`,
                `${member.user} just slid into the server... not for the first time!`,
                `${member.user}, Welcome back to ${member.guild.name}.`,
                `${member.user} just showed up! Welcome back!`,
                `Welcome back, ${member.user}. We hope you brought pizza.`,
                `Yay you made it back, ${member.user}!`,
            ];

            const emojiArray = [
                `<:welcome1:905792468765786152>`,
                `<:welcome2:906109766068207656>`,
                `<a:welcome3:905792474998538250>`,
                `<a:welcome4:905792482225299506>`,
                `<a:welcome5:905792521349787678>`,
                `<a:welcome6:905794343862960139>`,
                `<a:welcome7:905794349185503254>`,
                `<a:welcome8:906109820858400768>`,
                `<a:welcome9:906109836582879252>`,
                `<a:welcome10:906150303672455178>`,
                `<a:welcome11:906150315684950016>`,
                `<a:welcome12:906150349960790026>`,
            ];

            const randomTexts = textArray[~~(Math.random() * textArray.ength)];
            const randomEmojis = emojiArray[~~(Math.random() * emojiArray.length)];

            let channel = client.channels.cache.get("782837655082631229");
            await channel.send({
                content: `${randomEmojis} ${randomTexts} \`[#${member.guild.memberCount}]\``,
                allowedMentions: { parse: ["users"] }
            });
        };

        const embed = new MessageEmbed()
            .setAuthor({ name: `Member Joined!`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setColor("GREEN")
            .setDescription(`${member} has joined ${member.guild.name}.`)
            .addField("Username", `${member.user.tag}`, true)
            .addField("Account Creation", `<t:${~~(member.user.createdAt / 1000)}:d>`, true)
            .addField("Avatar", `[**Click Here**](${member.user.avatarURL()})`, true)
            .addField("Member Count", `${member.guild.members.cache.size}`, true)
            .addField("Humans Count", `${member.guild.members.cache.filter(member => !member.user.bot).size}`, true)
            .setFooter({ text: `${member.guild.name} | +1 member :D` })
            .setTimestamp()
        welcomechannel.send({ embeds: [embed] })

    })
});

client.on("guildMemberRemove", async member => {

    if (member.guild.id !== `${client.server.id}`) return

    const Roles = member.roles.cache.filter(r => r.id !== member.guild.id).map(role => role.id)
    if (Roles.length !== 0) {
        const data = new memberRoles({
            guildId: member.guild.id,
            userId: member.user.id,
            roles: [member.roles.cache.filter(r => r.id !== member.guild.id).map(role => role.id)],
            expires: Date.now() + ms('2 weeks')
        })
        data.save();
    }

    const welcomeChannel = member.guild.channels.cache.get('791152934045614121');
    const embed = new MessageEmbed()
        .setAuthor({ name: `Member Left!`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
        .setColor("RED")
        .setDescription(`${member} has left ${member.guild.name}.`)
        .addField("Username", `${member.user.tag}`, true)
        .addField("Member Joined", `<t:${~~(member.joinedAt / 1000)}:d>`, true)
        .addField("Avatar", `[**Click Here**](${member.user.avatarURL()})`, true)
        .addField("Member Count", `${member.guild.members.cache.size}`, true)
        .addField("Humans Count", `${member.guild.members.cache.filter(member => !member.user.bot).size}`, true)
        .setFooter({ text: `${member.guild.name} | -1 member :C` })
        .setTimestamp()

    welcomeChannel.send({
        embeds: [embed]
    })
})