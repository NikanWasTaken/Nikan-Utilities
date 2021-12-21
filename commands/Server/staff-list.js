const { MessageEmbed, BaseGuildTextChannel } = require('discord.js')

module.exports = {
    name: 'staff-list',
    category: 'server',
    description: "Shows all the staff members, with status filtering!",
    cooldown: 5000,
    aliases: ["stafflist", "online-staff", "onlinestaff", "modlist", "mod-list", "availablestaff", "onlinestaff", "onlinemod", "availablemod"],
    botCommand: true,


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        // roles
        const trainee = message.guild.roles.cache.get("818174764555304971")
        const mod = message.guild.roles.cache.get("814178652869623888")
        const headmod = message.guild.roles.cache.get("819205048872992768")
        const admin = message.guild.roles.cache.get("844073380046307348")
        const owner = message.guild.roles.cache.get("800976899337355294")

        // all 

        const AllStatusStaff = message.guild.members.cache.filter((m) => m?.roles.cache.get("818174764555304971") || m?.roles.cache.get("814178652869623888") || m?.roles.cache.get("819205048872992768") || m?.roles.cache.get("844073380046307348") || m?.roles.cache.get("800976899337355294"))

        // // ranks 

        // let rank = [];
        // if(trainee.members.forEach(e => rank.push("<:NUtrainee:910882017682530334>")) { rank.push("<:NUtrainee:910882017682530334>") }// trainee
        // else
        // if(AllStatusStaff.filter(m => m.roles.cache.get("814178652869623888"))) { rank.push("<:NUmod:910882016113885195>") } // mod
        // else
        // if(AllStatusStaff.filter(m => m.roles.cache.get("819205048872992768"))) { rank.push("<:NUhmod:910882014582951946>") }// head mod
        // else
        // if(AllStatusStaff.filter(m => m.roles.cache.get("844073380046307348"))) { rank.push("<:NUadmin:910883721597583440>") }// admin
        // else
        // if(AllStatusStaff.filter(m => m.roles.cache.get("800976899337355294"))) {rank.push("<:NUowner:910883111473131600>") }// owner



        // status filter

        const onlineStaff = AllStatusStaff.filter(m => m?.presence?.status === "online").map(m => `${m}`)
        const idleStaff = AllStatusStaff.filter(m => m?.presence?.status === "idle").map(m => `${m}`)
        const dndStaff = AllStatusStaff.filter(m => m?.presence?.status === "dnd").map(m => `${m}`)
        const offlineStaff = AllStatusStaff.filter(m => m?.presence == null).map(m => `${m}`)

        const embed = new MessageEmbed()
            .setAuthor(`Staff Members`, message.guild.iconURL({ dynamic: true }))
            .setColor("PURPLE")
            .setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))

        if (onlineStaff?.length !== 0) embed.addField("Online", `${onlineStaff?.join(" ")}`)
        if (idleStaff?.length !== 0) embed.addField("Idle", `${idleStaff?.join(" ")}`)
        if (dndStaff?.length !== 0) embed.addField("Do Not Disturb", `${dndStaff?.join(" ")}`)
        if (offlineStaff?.length !== 0) embed.addField("Offline/Invisible", `${offlineStaff?.join(" ")}`)


        message.reply({ embeds: [embed] })
    }
}