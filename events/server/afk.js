const client = require("../../index.js")
const moment = require("moment")
const afk = client.afk;



client.on('messageCreate', async message =>{

    if(!message.guild || message.author.bot) return 
    if(message.content.startsWith(`${client.config.prefix}afk`)) return

    const MentionedMember = message.mentions.members.first();

    if(MentionedMember) {
        const data = afk.get(MentionedMember.id);

        if(data) {
            const [ timestamp, reason ] = data;
            const Timeago = moment(timestamp).fromNow();

            message.reply(`${MentionedMember.user.username} is currently afk for reason: ${reason} ● ${Timeago}`)

        }
    }

    const getdata = afk.get(message.author.id)
    if(getdata) {
        afk.delete(message.author.id)
        message.reply(`Welcome back! I removed your afk!`).then((msg) => {
            setTimeout(() => {
                msg.delete()
            }, 5000)
        }).catch(e => { return })

        message.member.setNickname(message.author.username).catch(e => { return })
    }
})