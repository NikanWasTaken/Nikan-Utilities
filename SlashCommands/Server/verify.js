const { Client, CommandInteraction } = require("discord.js");

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
    run: async (client, interaction) => {

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


        if (interaction.member.roles.cache.get("793410990535999508"))
            return interaction.followUp({ content: "You're already verified!" });



        let channel = interaction.guild.channels.cache.get("782837655082631229");

        await interaction.member.roles.add("793410990535999508");
        await channel.send({ content: `${randomemojis} ${randomtexts} \`[#${interaction.guild.memberCount}]\``, allowedMentions: { parse: ["users"] } });
        interaction.editReply({ content: 'You have been verified!' });
    }
};