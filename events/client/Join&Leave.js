const client = require("../../index.js")
const { MessageEmbed } = require("discord.js")
const memberRoles = require("../../models/LeftMembers.js")


client.on("guildMemberAdd", member => {

    if (member.guild.id !== "757268973674037315") return
    const welcomechannel = client.channels.cache.get('791152934045614121');
    const allmembersvc = client.channels.cache.get("874721718319603743");
    const humansvc = client.channels.cache.get("874721721930878997");


    memberRoles.findOne({ guildid: member.guild.id, user: member.user.id }, async (err, data) => {

        if (err) throw err;
        if (data) {
            data.content.map((w, i) => member.roles.set(w.roles))
            await memberRoles.findOneAndDelete({ user: member.user.id, guildid: member.guild.id })

            const textarray = [
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

            const emojiarray = [
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

            const randomtexts = textarray[~~(Math.random() * textarray.length)];
            const randomemojis = emojiarray[~~(Math.random() * emojiarray.length)];

            let channel = client.channels.cache.get("782837655082631229")
            await channel.send({ content: `${randomemojis} ${randomtexts} \`[#${member.guild.memberCount}]\``, allowedMentions: { parse: ["users"] } })
        }

        const embed = new MessageEmbed()
            .setAuthor(`Member Joined!`, member.user.displayAvatarURL({ dynamic: true }))
            .setColor("GREEN")
            .setDescription(`${member} has joined ${member.guild.name}.`)
            .addField("Username", `${member.user.tag}`, true)
            .addField("Account Creation", `${member.user.createdAt.toLocaleDateString("en-us")}`, true)
            .addField("Avatar", `[**Click Here**](${member.user.avatarURL()})`, true)
            .addField("Member Count", `${member.guild.members.cache.size}`, true)
            .addField("Humans Count", `${member.guild.members.cache.filter(member => !member.user.bot).size}`, true)
            .setFooter(`${member.guild.name} | +1 member :D`)
            .setTimestamp()
        welcomechannel.send({ embeds: [embed] })
        allmembersvc.edit({ name: `All Members • ${member.guild.members.cache.size}` })
        humansvc.edit({ name: `Humans • ${member.guild.members.cache.filter(member => !member.user.bot).size}` })


    })


})


client.on("guildMemberRemove", async member => {

    if (member.guild.id !== "757268973674037315") return
    const allmembersvc = client.channels.cache.get("874721718319603743");
    const humansvc = client.channels.cache.get("874721721930878997");

    if (member.roles.cache.filter(r => r.id !== member.guild.id).size > 1) {

        const data = new memberRoles({
            guildid: member.guild.id,
            user: member.user.id,
            content: [{ roles: member.roles.cache.sort((a, b) => b.position - a.position).filter(r => r.id !== member.guild.id).map(role => role.id) }],
            expires: Date.now() + ms('2 weeks')
        })

        data.save()

    }

    const welcomechannel = member.guild.channels.cache.get('791152934045614121')

    const embed = new MessageEmbed()
        .setAuthor(`Member Left!`, member.user.displayAvatarURL({ dynamic: true }))
        .setColor("RED")
        .setDescription(`${member} has left ${member.guild.name}.`)
        .addField("Username", `${member.user.tag}`, true)
        .addField("Member Joined", `${member.joinedAt.toLocaleDateString("en-us")}`, true)
        .addField("Avatar", `[**Click Here**](${member.user.avatarURL()})`, true)
        .addField("Member Count", `${member.guild.members.cache.size}`, true)
        .addField("Humans Count", `${member.guild.members.cache.filter(member => !member.user.bot).size}`, true)
        .setFooter(`${member.guild.name} | -1 member :C`)
        .setTimestamp()

    welcomechannel.send({ embeds: [embed] })
    allmembersvc.edit({ name: `All Members • ${member.guild.members.cache.size}` })
    humansvc.edit({ name: `Humans • ${member.guild.members.cache.filter(member => !member.user.bot).size}` })




})