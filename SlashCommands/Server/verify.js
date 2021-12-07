const { Client, CommandInteraction, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require("discord.js");
const { Captcha } = require("captcha-canvas");
const { i } = require("mathjs");

module.exports = {
    name: "verify",
    description: `This command will help you to enter the server!`,
    ephemeral: true,
    cooldown: 10000,


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const textarray = [
            `${interaction.user} just showed up!`,
            `${interaction.user} just landed!`,
            `${interaction.user} joined the party!`,
            `Welcome ${interaction.user}. Say hi!`,
            `Good to see you, ${interaction.user}!`,
            `${interaction.user} is here!`,
            `Glad you're here, ${interaction.user}.`,
            `Everyone welcome ${interaction.user}.`,
            `A wild ${interaction.user} appeared.`,
            `${interaction.user} just slid into the server.`,
            `${interaction.user}, Welcome to ${interaction.guild.name}.`,
            `${interaction.user} just showed up!`,
            `Welcome, ${interaction.user}. We hope you brought pizza.`,
            `Yay you made it, ${interaction.user}!`,
            `${interaction.user} just verified into the server!`,
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


        if (interaction.member.roles.cache.get("793410990535999508")) return interaction.followUp({ content: "You're already verified!" })

        const captcha = new Captcha();
        captcha.async = true;
        captcha.addDecoy();
        captcha.drawTrace();
        captcha.drawCaptcha();

        var attachment = new MessageAttachment(await captcha.png, "captcha.png")

        let embed = new MessageEmbed()
            .setAuthor(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
            .setTitle(`Solve the captcha!`).setURL(`${client.server.invite}`)
            .setDescription("Please solve the captcha that you see below! Send the letters you see in the currect channel!")
            .setColor(`${client.color.botBlue}`)
            .setImage("attachment://captcha.png")
            .setFooter(`You have 20 seconds to solve this captcha!`, `${client.user.displayAvatarURL()}`)

        let msg = await interaction.followUp({ embeds: [embed], files: [attachment] })

        const collector = interaction.channel.createMessageCollector({
            filter: (m) =>
                m.author.id === interaction.user.id,
            max: 1,
            time: 20000,
        });

        collector.on("collect", async (m) => {

            if (m.author.id !== interaction.user.id) return;
            const verified = (m.content === captcha.text)

            if (verified) {

                const row = new MessageActionRow().addComponents(

                    new MessageButton()
                        .setLabel("General Channel")
                        .setStyle("LINK")
                        .setURL(`https://discord.com/channels/${client.server.id}/782837655082631229`)
                )

                m.delete()

                let channel = interaction.guild.channels.cache.get("782837655082631229")

                await interaction.member.roles.add("793410990535999508")
                await channel.send({ content: `${randomemojis} ${randomtexts} \`[#${interaction.guild.memberCount}]\``, allowedMentions: { parse: ["users"] } })

                let embedcorrect = new MessageEmbed()
                    .setAuthor(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
                    .setTitle("Answer was correct!").setURL(`${client.server.invite}`)
                    .setColor(`${client.color.success}`)
                    .setDescription("Congratulation! You have solved the captcha and entered the server!")
                    .addField(`Correct Answer`, `➜ **${captcha.text}**`)
                    .setImage("attachment://captcha.png")

                await interaction.editReply({ embeds: [embedcorrect], components: [row] })


            } else if (!verified) {


                m.delete()

                let embedwrong = new MessageEmbed()
                    .setAuthor(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
                    .setTitle("Answer was wrong!").setURL(`${client.server.invite}`)
                    .setColor(`${client.color.failed}`)
                    .setDescription("You've answered the captcha wrong! Please run \`/verify\` and try again!")
                    .addField(`Correct Answer`, `➜ **${captcha.text}**`)
                    .setImage("attachment://captcha.png")

                await interaction.editReply({ embeds: [embedwrong], files: [attachment] })

            }

        });

        collector.on("end", async (m) => {

            const emo = new MessageEmbed()
                .setAuthor(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`Verification Timed Out!`).setURL(`${client.server.invite}`)
                .setDescription("The verificaton timed out due to your late respond! Please run \`/verify\` again to start the verification.")
                .setColor(`RED`)
                .addField(`Correct Answer`, `➜ **${captcha.text}**`)
                .setImage("attachment://captcha.png")
                .setFooter(`Captcha Timed Out`, `${client.user.displayAvatarURL()}`)

            await interaction.editReply({ embeds: [emo], components: [] })
        })

    }
}